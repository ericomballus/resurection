package com.usbprint.cordova;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbManager;
import android.hardware.usb.UsbConstants;
import android.hardware.usb.UsbDevice;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import com.usbprint.cordova.Printer;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Iterator;
import java.io.ByteArrayOutputStream;
import android.util.Log;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Bitmap.Config;
import android.util.Xml.Encoding;
import android.util.Base64;
import java.util.ArrayList;
import java.util.List;

public class PrinterService extends CordovaPlugin {
    Bitmap bitmap;
    private static final String TAG = "USBPrint";
    protected static final String ACTION_USB_PERMISSION = "com.gokhana.connection.USB";
    public static final int USB_CONNECTED = 0;
    public static final int USB_DISCONNECTED = 1;
    private static Map<String, Printer> printers = new HashMap<String, Printer>();
    private UsbManager usbManager;
    private Context applicationContext;
     public static final byte LINE_FEED = 0x0A;
    public static final byte[] CODIFICATION = new byte[] { 0x1b, 0x4D, 0x01 };

    public static final byte[] ESC_ALIGN_LEFT = { 0x1B, 0x61, 0x00 };
    public static final byte[] ESC_ALIGN_RIGHT = { 0x1B, 0x61, 0x02 };
    public static final byte[] ESC_ALIGN_CENTER = { 0x1B, 0x61, 0x01 };

    public static final byte[] CHAR_SIZE_00 = { 0x1B, 0x21, 0x00 };// Normal size
    public static final byte[] CHAR_SIZE_01 = { 0x1B, 0x21, 0x01 };// Reduzided width
    public static final byte[] CHAR_SIZE_08 = { 0x1B, 0x21, 0x08 };// bold normal size
    public static final byte[] CHAR_SIZE_10 = { 0x1B, 0x21, 0x10 };// Double height size
    public static final byte[] CHAR_SIZE_11 = { 0x1B, 0x21, 0x11 };// Reduzided Double height size
    public static final byte[] CHAR_SIZE_20 = { 0x1B, 0x21, 0x20 };// Double width size
    public static final byte[] CHAR_SIZE_30 = { 0x1B, 0x21, 0x30 };
    public static final byte[] CHAR_SIZE_31 = { 0x1B, 0x21, 0x31 };
    public static final byte[] CHAR_SIZE_51 = { 0x1B, 0x21, 0x51 };
    public static final byte[] CHAR_SIZE_61 = { 0x1B, 0x21, 0x61 };

    public static final byte[] UNDERL_OFF = { 0x1b, 0x2d, 0x00 }; // Underline font OFF
    public static final byte[] UNDERL_ON = { 0x1b, 0x2d, 0x01 }; // Underline font 1-dot ON
    public static final byte[] UNDERL2_ON = { 0x1b, 0x2d, 0x02 }; // Underline font 2-dot ON
    public static final byte[] BOLD_OFF = { 0x1b, 0x45, 0x00 }; // Bold font OFF
    public static final byte[] BOLD_ON = { 0x1b, 0x45, 0x01 }; // Bold font ON
    public static final byte[] FONT_A = { 0x1b, 0x4d, 0x00 }; // Font type A
    public static final byte[] FONT_B = { 0x1b, 0x4d, 0x01 }; // Font type B




    @Override
    protected void pluginInitialize() {
        Log.d(TAG, "Initializing Printer Service");
        this.applicationContext = getApplicationContext();
        this.usbManager = ((UsbManager) this.applicationContext.getSystemService("usb"));
    }

    private final BroadcastReceiver mPermissionReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            getApplicationContext().unregisterReceiver(this);
            if ((intent.getAction().equals(ACTION_USB_PERMISSION))) {
                synchronized (this) {
                    UsbDevice dev = (UsbDevice) intent.getParcelableExtra("device");
                    if (dev != null) {
                        if (printers.size() > 0) {
                            Log.d(TAG,
                                    "This is first printer connected via this plugin, so registration for device detach.");
                            registerForDetachBroadcast();
                        }
                        String printer_name = constructPrinterName(dev);
                        Printer p = printers.get(printer_name);
                        if (intent.getBooleanExtra("permission", false)) {
                            Log.d(TAG, "Got Permission for USB printer: " + printer_name);
                            if (p != null) {
                                p.changeStateToConnected();
                            }
                        } else {
                            Log.d(TAG, "Permission denied for USB printer: " + printer_name);
                            if (p != null) {
                                p.close();
                                printers.remove(printer_name);
                            }
                        }
                    }
                }
            }
        }
    };

    private final BroadcastReceiver detachReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(UsbManager.ACTION_USB_DEVICE_DETACHED))
                synchronized (this) {
                    UsbDevice dev = (UsbDevice) intent.getParcelableExtra("device");
                    if (dev != null) {
                        String printer_name = constructPrinterName(dev);
                        Toast.makeText(cordova.getActivity().getApplicationContext(),
                                "Printer " + printer_name + " got disconnected", Toast.LENGTH_SHORT).show();
                        Printer p = printers.get(printer_name);
                        if (p != null) {
                            p.close();
                            printers.remove(printer_name);
                        }
                    }
                    Log.d(TAG, "Registered printer via this plugin is empty, so stopping device registration.");
                    if (printers.size() == 0) {
                        applicationContext.unregisterReceiver(detachReceiver);
                    }
                }
        }
    };

    private void registerForDetachBroadcast() {
        IntentFilter filter = new IntentFilter(UsbManager.ACTION_USB_DEVICE_DETACHED);
        applicationContext.registerReceiver(detachReceiver, filter);
    }

    private Context getApplicationContext() {
        return cordova.getActivity().getApplicationContext();
    }

    private String constructPrinterName(UsbDevice usbDevice) {
        return usbDevice.getVendorId() + "_" + usbDevice.getDeviceId();
    }

    @Override
    public void onDestroy() {
        synchronized (this) {
            this.printers.clear();
            try {
                this.applicationContext.unregisterReceiver(this.detachReceiver);
            } catch (Exception exp) {
                Log.e(TAG, "Issue while unregistering USB detach listener",exp);
            }
            try {
                this.applicationContext.unregisterReceiver(this.mPermissionReceiver);
            } catch (Exception exp) {
                Log.e(TAG, "Issue while unregistering USB permission listener", exp);
            }
        }
    }

    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getConnectedPrinters")) {
            getConnectedPrinters(callbackContext);
            return true;
        } else if (action.equals("connect")) {
            String printer_name = args.getString(0);
            connect(printer_name, callbackContext);
            return true;
        } else if (action.equals("disconnect")) {
            String printer_name = args.getString(0);
            disconnect(printer_name, callbackContext);
            return true;
        } else if (action.equals("print")) {
            String printer_name = args.getString(0);
            String msg = args.getString(1);
            print(printer_name, msg, callbackContext);
            return true;
        } else if (action.equals("sendCommand")) {
            String printer_name = args.getString(0);
            byte[] data = args.getArrayBuffer(1);
            sendCommand(printer_name, data, callbackContext);
            return true;
        } else if (action.equals("isPaperAvailable")) {
            String printer_name = args.getString(0);
            isPaperAvailable(printer_name, callbackContext);
            return true;
        } else if (action.equals("cutPaper")) {
            String printer_name = args.getString(0);
            cutPaper(printer_name, callbackContext);
            return true;
        }  else if (action.equals("addImage")) {
              String printer_name = args.getString(0);
            String msg = args.getString(1);
            maeriImage(printer_name, msg, callbackContext);
            return true;
        } else if (action.equals("printTotal")) { 
            String printer_name = args.getString(0);
            String msg = args.getString(1);
           
            printTotal(printer_name, msg, callbackContext);
            return true;
        }else if (action.equals("sendTitle")) { 
            String printer_name = args.getString(0);
            String msg = args.getString(1);
            printTitle(printer_name, msg, callbackContext);
            return true;
        }else if (action.equals("printInvoice")) {
              String printer_name = args.getString(0);
            String msg = args.getString(1);
            invoiceMaeri(printer_name, msg, callbackContext);
            return true;
        }
        return false;
    }
   
    private void getConnectedPrinters(final CallbackContext callbackContext) {
        JSONArray printers = new JSONArray();
        JSONObject jsonObj = new JSONObject();
        Log.d(TAG, String.format("Found: %s Devices ", usbManager.getDeviceList().size()));
        List<UsbDevice> lstPrinters = new ArrayList(usbManager.getDeviceList().values());
        for (UsbDevice usbDevice : lstPrinters) {
            if (UsbConstants.USB_CLASS_PRINTER == usbDevice.getInterface(0).getInterfaceClass()) {
                try {
                    printers.put(this.injectDeviceInfo(usbDevice));
                } catch (JSONException err) {
                    Log.e(TAG, "Exception in parsing to JSON object");
                }
            }
        }
        if (printers.length() <= 0) {
            Log.d(TAG, "No Printers identified");
        }
        callbackContext.success(printers);
    }

    private JSONObject injectDeviceInfo(UsbDevice usbDevice) throws JSONException {
        JSONObject printerObj = new JSONObject()
                .put("printername", usbDevice.getVendorId() + "_" + usbDevice.getDeviceId())
                .put("deviceId", usbDevice.getDeviceId()).put("vendorId", usbDevice.getVendorId());
        // try {
        // printerObj.put("productName", usbDevice.getProductName());
        // printerObj.put("manufacturerName", usbDevice.getManufacturerName());
        // printerObj.put("deviceName", usbDevice.getDeviceName());
        // printerObj.put("serialNumber", usbDevice.getSerialNumber());
        // printerObj.put("protocol", usbDevice.getDeviceProtocol());
        // printerObj.put("deviceClass",
        // usbDevice.getDeviceClass() + "_" +
        // translateDeviceClass(usbDevice.getDeviceClass()));
        // printerObj.put("deviceSubClass", usbDevice.getDeviceSubclass());
        // } catch (Exception exp) {
        // Log.e(TAG, "Exception in parsing to JSON object" + exp.getMessage());
        // } catch (Error err) {
        // Log.e(TAG, "Error in parsing to JSON object" + err.getMessage());
        // }
        return printerObj;
    }

    private void connect(String printer_name, final CallbackContext callbackContext) {
        UsbDevice device = getDevice(printer_name);
        if (device != null) {
            Log.d(TAG, "Requesting permission for the device " + device.getDeviceId());
            getPermission(device, callbackContext);
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }

    private void disconnect(String printer_name, final CallbackContext callbackContext) {
        Printer device = printers.get(printer_name);
        if (device != null) {
            device.close();
            printers.remove(printer_name);
            if (printers.size() == 0) {
                applicationContext.unregisterReceiver(detachReceiver);
            }
            callbackContext.success("DisConnected");
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }

    private void isPaperAvailable(String printer_name, final CallbackContext callbackContext) {
        Printer device = printers.get(printer_name);
        if (device != null) {
            callbackContext.success(String.valueOf(device.isPaperAvailable()));
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }

    private void cutPaper(String printer_name, final CallbackContext callbackContext) {
        Printer device = printers.get(printer_name);
        if (device != null) {
            device.cutPaper(0);
            callbackContext.success("true");
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }

    private void sendCommand(String printer_name, byte[] command, final CallbackContext callbackContext) {
        Printer device = printers.get(printer_name);
        if (device != null) {
            device.sendByte(command);
            callbackContext.success("Send");
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }

    private void print(String printer_name, String msg, final CallbackContext callbackContext) {
        Printer device = printers.get(printer_name);
        if (device != null) {
            if (device.isPaperAvailable()) {
                device.sendMsg(msg, "GBK");
                callbackContext.success("Printed");
            } else {
                Toast.makeText(cordova.getActivity().getApplicationContext(), "Paper roll is empty in printer "
                        + printer_name + ". Please place some paper before printing any data.", Toast.LENGTH_SHORT)
                        .show();
                callbackContext.error("Paper roll is empty");
            }
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }

    private void printTitle(String printer_name, String msg, final CallbackContext callbackContext) {
        Printer device = printers.get(printer_name);
        if (device != null) {
            if (device.isPaperAvailable()) {
                device.sendTitle(msg, "GBK", ESC_ALIGN_CENTER);
                callbackContext.success("Printed");
            } else {
                Toast.makeText(cordova.getActivity().getApplicationContext(), "Paper roll is empty in printer "
                        + printer_name + ". Please place some paper before printing any data.", Toast.LENGTH_SHORT)
                        .show();
                callbackContext.error("Paper roll is empty");
            }
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }
    private void printTotal(String printer_name, String msg, final CallbackContext callbackContext) {
        Printer device = printers.get(printer_name);
        if (device != null) {
            if (device.isPaperAvailable()) {
               
                device.sendTotal(msg, "GBK");
                callbackContext.success("Printed");
            } else {
                Toast.makeText(cordova.getActivity().getApplicationContext(), "Paper roll is empty in printer "
                        + printer_name + ". Please place some paper before printing any data.", Toast.LENGTH_SHORT)
                        .show();
                callbackContext.error("Paper roll is empty");
            }
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
    }
 private void maeriImage(String printer_name, String msg, final CallbackContext callbackContext) {
      Printer device = printers.get(printer_name);
    String base64String = msg;
    String base64Image = base64String.split(",")[1];
         

            final byte[] decodedString = Base64.decode(base64Image, Base64.DEFAULT);
  //  byte[] decodedString = Base64.decode(base64Image, Base64.DEFAULT);
         Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
   
           Bitmap bitmap1 = decodedByte;
            int mWidth = bitmap1.getWidth();
            int mHeight = bitmap1.getHeight();
          // bitmap1 = resizeImage(bitmap1, 200, 200);
         bitmap1 = resizeImage(bitmap1, 250, 250);
          byte[] bt = decodeBitmapBase64(bitmap1);
        if (device != null) {
            if (device.isPaperAvailable()) {
                device.sendImage(bt, ESC_ALIGN_CENTER);
               
                callbackContext.success("Printed");
            } else {
                Toast.makeText(cordova.getActivity().getApplicationContext(), "Paper roll is empty in printer "
                        + printer_name + ". Please place some paper before printing any data.", Toast.LENGTH_SHORT)
                        .show();
                callbackContext.error("Paper roll is empty");
            }
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
         
       
    }

    private void invoiceMaeri(String printer_name, String msg, final CallbackContext callbackContext) {
      Printer device = printers.get(printer_name);
    String base64String = msg;
    String base64Image = base64String.split(",")[1];
         

            final byte[] decodedString = Base64.decode(base64Image, Base64.DEFAULT);
  //  byte[] decodedString = Base64.decode(base64Image, Base64.DEFAULT);
         Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
   
           Bitmap bitmap1 = decodedByte;
            int mWidth = bitmap1.getWidth();
            int mHeight = bitmap1.getHeight();
          bitmap1 = resizeImage(bitmap1, 400, 400);
          byte[] bt = decodeBitmapBase64(bitmap1);
        if (device != null) {
            if (device.isPaperAvailable()) {
                device.sendImage(bt, ESC_ALIGN_CENTER);
               
                callbackContext.success("Printed");
            } else {
                Toast.makeText(cordova.getActivity().getApplicationContext(), "Paper roll is empty in printer "
                        + printer_name + ". Please place some paper before printing any data.", Toast.LENGTH_SHORT)
                        .show();
                callbackContext.error("Paper roll is empty");
            }
        } else {
            callbackContext.error("No Printer of specified name is connected");
        }
         
       
    }
    private synchronized void getPermission(UsbDevice dev, final CallbackContext callbackContext) {
        if (dev == null) {
            callbackContext.error("No Printer of specified name is connected");
            return;
        }
        String printer_name = this.constructPrinterName(dev);
        if (!usbManager.hasPermission(dev)) {
            Printer p = new Printer(this.usbManager, dev, printer_name, callbackContext);
            this.printers.put(printer_name, p);
            PendingIntent pi = PendingIntent.getBroadcast(this.applicationContext, 0, new Intent(ACTION_USB_PERMISSION),
                    0);
            this.applicationContext.registerReceiver(this.mPermissionReceiver, new IntentFilter(ACTION_USB_PERMISSION));
            this.usbManager.requestPermission(dev, pi);
        } else {
            Printer p = this.printers.get(printer_name);
            if (p == null) {
                p = new Printer(this.usbManager, dev, printer_name, callbackContext);
                p.changeStateToConnected();
                this.printers.put(printer_name, p);
            } else {
                Log.d(TAG, String.format("Already got permission for %s Device, so returning 'Connected' status.",
                        printer_name));
                callbackContext.success("Connected");
            }
        }
    }

    private UsbDevice getDevice(String printer_name) {
        Log.d(TAG, String.format("Found: %s Devices ", usbManager.getDeviceList().size()));
        String[] parts = printer_name.split("_");
        if (parts.length == 2) {
            List<UsbDevice> lstPrinters = new ArrayList(usbManager.getDeviceList().values());
            for (UsbDevice usbDevice : lstPrinters) {
                if (usbDevice.getVendorId() == Integer.valueOf(parts[0])
                        && usbDevice.getDeviceId() == Integer.parseInt(parts[1])) {
                    return usbDevice;
                }
            }
        }
        return null;
    }

    private String translateDeviceClass(int deviceClass) {
        switch (deviceClass) {
        case UsbConstants.USB_CLASS_APP_SPEC:
            return "Application specific USB class";
        case UsbConstants.USB_CLASS_AUDIO:
            return "USB class for audio devices";
        case UsbConstants.USB_CLASS_CDC_DATA:
            return "USB class for CDC devices (communications device class)";
        case UsbConstants.USB_CLASS_COMM:
            return "USB class for communication devices";
        case UsbConstants.USB_CLASS_CONTENT_SEC:
            return "USB class for content security devices";
        case UsbConstants.USB_CLASS_CSCID:
            return "USB class for content smart card devices";
        case UsbConstants.USB_CLASS_HID:
            return "USB class for human interface devices (for example, mice and keyboards)";
        case UsbConstants.USB_CLASS_HUB:
            return "USB class for USB hubs";
        case UsbConstants.USB_CLASS_MASS_STORAGE:
            return "USB class for mass storage devices";
        case UsbConstants.USB_CLASS_MISC:
            return "USB class for wireless miscellaneous devices";
        case UsbConstants.USB_CLASS_PER_INTERFACE:
            return "USB class indicating that the class is determined on a per-interface basis";
        case UsbConstants.USB_CLASS_PHYSICA:
            return "USB class for physical devices";
        case UsbConstants.USB_CLASS_PRINTER:
            return "USB class for printers";
        case UsbConstants.USB_CLASS_STILL_IMAGE:
            return "USB class for still image devices (digital cameras)";
        case UsbConstants.USB_CLASS_VENDOR_SPEC:
            return "Vendor specific USB class";
        case UsbConstants.USB_CLASS_VIDEO:
            return "USB class for video devices";
        case UsbConstants.USB_CLASS_WIRELESS_CONTROLLER:
            return "USB class for wireless controller devices";
        default:
            return "Unknown USB class!";
        }
    }

    private static Bitmap resizeImage(Bitmap bitmap, int w, int h) {
        Bitmap BitmapOrg = bitmap;
        int width = BitmapOrg.getWidth();
        int height = BitmapOrg.getHeight();

        if (width > w) {
            float scaleWidth = ((float) w) / width;
            float scaleHeight = ((float) h) / height + 24;
            Matrix matrix = new Matrix();
            matrix.postScale(scaleWidth, scaleWidth);
            Bitmap resizedBitmap = Bitmap.createBitmap(BitmapOrg, 0, 0, width, height, matrix, true);
            return resizedBitmap;
        } else {
            Bitmap resizedBitmap = Bitmap.createBitmap(w, height + 24, Config.RGB_565);
            Canvas canvas = new Canvas(resizedBitmap);
            Paint paint = new Paint();
            canvas.drawColor(Color.WHITE);
            canvas.drawBitmap(bitmap, (w - width) / 2, 0, paint);
            return resizedBitmap;
        }
    }

    public static byte[] decodeBitmapBase64(Bitmap bmp) {
        int bmpWidth = bmp.getWidth();
        int bmpHeight = bmp.getHeight();
        List<String> list = new ArrayList<String>(); // binaryString list
        StringBuffer sb;
        int bitLen = bmpWidth / 8;
        int zeroCount = bmpWidth % 8;
        String zeroStr = "";
        if (zeroCount > 0) {
            bitLen = bmpWidth / 8 + 1;
            for (int i = 0; i < (8 - zeroCount); i++) {
                zeroStr = zeroStr + "0";
            }
        }

        for (int i = 0; i < bmpHeight; i++) {
            sb = new StringBuffer();
            for (int j = 0; j < bmpWidth; j++) {
                int color = bmp.getPixel(j, i);

                int r = (color >> 16) & 0xff;
                int g = (color >> 8) & 0xff;
                int b = color & 0xff;
                // if color close to white???bit='0', else bit='1'
                if (r > 160 && g > 160 && b > 160) {
                    sb.append("0");
                } else {
                    sb.append("1");
                }
            }
            if (zeroCount > 0) {
                sb.append(zeroStr);
            }
            list.add(sb.toString());
        }

        List<String> bmpHexList = binaryListToHexStringList(list);
        String commandHexString = "1D763000";

        // construct xL and xH
        // there are 8 pixels per byte. In case of modulo: add 1 to compensate.
        bmpWidth = bmpWidth % 8 == 0 ? bmpWidth / 8 : (bmpWidth / 8 + 1);
        int xL = bmpWidth % 256;
        int xH = (bmpWidth - xL) / 256;

        String xLHex = Integer.toHexString(xL);
        String xHHex = Integer.toHexString(xH);
        if (xLHex.length() == 1) {
            xLHex = "0" + xLHex;
        }
        if (xHHex.length() == 1) {
            xHHex = "0" + xHHex;
        }
        String widthHexString = xLHex + xHHex;

        // construct yL and yH
        int yL = bmpHeight % 256;
        int yH = (bmpHeight - yL) / 256;

        String yLHex = Integer.toHexString(yL);
        String yHHex = Integer.toHexString(yH);
        if (yLHex.length() == 1) {
            yLHex = "0" + yLHex;
        }
        if (yHHex.length() == 1) {
            yHHex = "0" + yHHex;
        }
        String heightHexString = yLHex + yHHex;

        List<String> commandList = new ArrayList<String>();
        commandList.add(commandHexString + widthHexString + heightHexString);
        commandList.addAll(bmpHexList);

        return hexList2Byte(commandList);
    }

    public static byte[] decodeBitmapUrl(Bitmap bmp) {
        int bmpWidth = bmp.getWidth();
        int bmpHeight = bmp.getHeight();

        List<String> list = new ArrayList<String>(); // binaryString list
        StringBuffer sb;

        int bitLen = bmpWidth / 8;
        int zeroCount = bmpWidth % 8;

        String zeroStr = "";
        if (zeroCount > 0) {
            bitLen = bmpWidth / 8 + 1;
            for (int i = 0; i < (8 - zeroCount); i++) {
                zeroStr = zeroStr + "0";
            }
        }

        for (int i = 0; i < bmpHeight; i++) {
            sb = new StringBuffer();
            for (int j = 0; j < bmpWidth; j++) {
                int color = bmp.getPixel(j, i);

                int r = (color >> 16) & 0xff;
                int g = (color >> 8) & 0xff;
                int b = color & 0xff;
                // if color close to white???bit='0', else bit='1'
                if (r > 160 && g > 160 && b > 160) {
                    sb.append("0");
                } else {
                    sb.append("1");
                }
            }
            if (zeroCount > 0) {
                sb.append(zeroStr);
            }
            list.add(sb.toString());
        }

        List<String> bmpHexList = binaryListToHexStringList(list);
        String commandHexString = "1D763000";
        String widthHexString = Integer.toHexString(bmpWidth % 8 == 0 ? bmpWidth / 8 : (bmpWidth / 8 + 1));
        if (widthHexString.length() > 2) {
            Log.e("decodeBitmap error", " width is too large");
            return null;
        } else if (widthHexString.length() == 1) {
            widthHexString = "0" + widthHexString;
        }
        widthHexString = widthHexString + "00";

        String heightHexString = Integer.toHexString(bmpHeight);
        if (heightHexString.length() > 2) {
            Log.e("decodeBitmap error", " height is too large");
            return null;
        } else if (heightHexString.length() == 1) {
            heightHexString = "0" + heightHexString;
        }
        heightHexString = heightHexString + "00";

        List<String> commandList = new ArrayList<String>();
        commandList.add(commandHexString + widthHexString + heightHexString);
        commandList.addAll(bmpHexList);

        return hexList2Byte(commandList);
    }

    public static List<String> binaryListToHexStringList(List<String> list) {
        List<String> hexList = new ArrayList<String>();
        for (String binaryStr : list) {
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < binaryStr.length(); i += 8) {
                String str = binaryStr.substring(i, i + 8);

                String hexString = myBinaryStrToHexString(str);
                sb.append(hexString);
            }
            hexList.add(sb.toString());
        }
        return hexList;

    }

    public static String myBinaryStrToHexString(String binaryStr) {
        String hex = "";
        String f4 = binaryStr.substring(0, 4);
        String b4 = binaryStr.substring(4, 8);
        for (int i = 0; i < binaryArray.length; i++) {
            if (f4.equals(binaryArray[i])) {
                hex += hexStr.substring(i, i + 1);
            }
        }
        for (int i = 0; i < binaryArray.length; i++) {
            if (b4.equals(binaryArray[i])) {
                hex += hexStr.substring(i, i + 1);
            }
        }

        return hex;
    }

    private static String hexStr = "0123456789ABCDEF";

    private static String[] binaryArray = { "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000",
            "1001", "1010", "1011", "1100", "1101", "1110", "1111" };

    public static byte[] hexList2Byte(List<String> list) {
        List<byte[]> commandList = new ArrayList<byte[]>();

        for (String hexStr : list) {
            commandList.add(hexStringToBytes(hexStr));
        }
        byte[] bytes = sysCopy(commandList);
        return bytes;
    }

    // New implementation, change old
    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
        }
        return d;
    }

    private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }

    public static byte[] sysCopy(List<byte[]> srcArrays) {
        int len = 0;
        for (byte[] srcArray : srcArrays) {
            len += srcArray.length;
        }
        byte[] destArray = new byte[len];
        int destLen = 0;
        for (byte[] srcArray : srcArrays) {
            System.arraycopy(srcArray, 0, destArray, destLen, srcArray.length);
            destLen += srcArray.length;
        }
        return destArray;
    }

    public static byte[] getBitmapData(Bitmap bitmap) {
		byte temp = 0;
		int j = 7;
		int start = 0;
		if (bitmap != null) {
			int mWidth = bitmap.getWidth();
			int mHeight = bitmap.getHeight();

			int[] mIntArray = new int[mWidth * mHeight];
			bitmap.getPixels(mIntArray, 0, mWidth, 0, 0, mWidth, mHeight);
			bitmap.recycle();
			byte []data=encodeYUV420SP(mIntArray, mWidth, mHeight);
			byte[] result = new byte[mWidth * mHeight / 8];
			for (int i = 0; i < mWidth * mHeight; i++) {
				temp = (byte) ((byte) (data[i] << j) + temp);
				j--;
				if (j < 0) {
					j = 7;
				}
				if (i % 8 == 7) {
					result[start++] = temp;
					temp = 0;
				}
			}
			if (j != 7) {
				result[start++] = temp;
			}

			int aHeight = 24 - mHeight % 24;
			int perline = mWidth / 8;
			byte[] add = new byte[aHeight * perline];
			byte[] nresult = new byte[mWidth * mHeight / 8 + aHeight * perline];
			System.arraycopy(result, 0, nresult, 0, result.length);
			System.arraycopy(add, 0, nresult, result.length, add.length);

			byte[] byteContent = new byte[(mWidth / 8 + 4)
					* (mHeight + aHeight)];//
			byte[] bytehead = new byte[4];//
			bytehead[0] = (byte) 0x1f;
			bytehead[1] = (byte) 0x10;
			bytehead[2] = (byte) (mWidth / 8);
			bytehead[3] = (byte) 0x00;
			for (int index = 0; index < mHeight + aHeight; index++) {
				System.arraycopy(bytehead, 0, byteContent, index
						* (perline + 4), 4);
				System.arraycopy(nresult, index * perline, byteContent, index
						* (perline + 4) + 4, perline);
			}
			return byteContent;
		}
		return null;

	}

	public static byte[] encodeYUV420SP(int[] rgba, int width, int height) {
		final int frameSize = width * height;
		byte[] yuv420sp=new byte[frameSize];
		int[] U, V;
		U = new int[frameSize];
		V = new int[frameSize];
		final int uvwidth = width / 2;
		int r, g, b, y, u, v;
		int bits = 8;
		int index = 0;
		int f = 0;
		for (int j = 0; j < height; j++) {
			for (int i = 0; i < width; i++) {
				r = (rgba[index] & 0xff000000) >> 24;
				g = (rgba[index] & 0xff0000) >> 16;
				b = (rgba[index] & 0xff00) >> 8;
				// rgb to yuv
				y = ((66 * r + 129 * g + 25 * b + 128) >> 8) + 16;
				u = ((-38 * r - 74 * g + 112 * b + 128) >> 8) + 128;
				v = ((112 * r - 94 * g - 18 * b + 128) >> 8) + 128;
				// clip y
				// yuv420sp[index++] = (byte) ((y < 0) ? 0 : ((y > 255) ? 255 :
				// y));
				byte temp = (byte) ((y < 0) ? 0 : ((y > 255) ? 255 : y));
				yuv420sp[index++] = temp > 0 ? (byte) 1 : (byte) 0;

				// {
				// if (f == 0) {
				// yuv420sp[index++] = 0;
				// f = 1;
				// } else {
				// yuv420sp[index++] = 1;
				// f = 0;
				// }

				// }

			}

		}
		f = 0;
		return yuv420sp;
	}

}

    
