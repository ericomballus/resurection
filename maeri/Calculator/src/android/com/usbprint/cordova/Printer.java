package com.usbprint.cordova;

import android.hardware.usb.UsbConstants;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbManager;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbDeviceConnection;
import android.util.Log;

import java.io.UnsupportedEncodingException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

public class Printer {

    private static final String TAG = "USBPrint";
    private String printername = null;
    private boolean connected = false;
    private UsbDevice device;
    private UsbManager usbManager;
    private UsbEndpoint ep = null;
    private UsbInterface usbInt = null;
    private UsbDeviceConnection conn = null;
    private CallbackContext callbackContext;
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

    public Printer(UsbManager usbManager, UsbDevice usbDevice, String printer_name, CallbackContext callbackContext) {
        this.usbManager = usbManager;
        this.device = usbDevice;
        this.printername = printer_name;
        this.callbackContext = callbackContext;
    }

    public String getPrinterName() {
        return printername;
    }

    public synchronized void changeStateToConnected() {
        this.connected = true;
        if (this.callbackContext != null) {
            PluginResult res = new PluginResult(PluginResult.Status.OK, "Connected");
            res.setKeepCallback(true);
            this.callbackContext.sendPluginResult(res);
        }
    }

    public byte revByte() {
        byte[] bits = new byte[2];
        try {
            if (this.conn == null) {
                this.conn = this.usbManager.openDevice(this.device);
            }
            this.conn.controlTransfer(161, 1, 0, 0, bits, bits.length, 0);
        } catch (Exception exp) {
            Log.e(TAG, "Exception thrown while connecting to usb printer", exp);
            this.close();
            return bits[0];
        }
        return bits[0];
    }

    public boolean isPaperAvailable() {
        byte isHasPaper = this.revByte();
        if (isHasPaper == 0x38) {
            return false;
        } else {
            return true;
        }
    }

    public boolean isPermissionGranted() {
        return this.usbManager.hasPermission(this.device);
    }

    public synchronized void close() {
        this.connected = false;
        if (this.conn != null) {
            this.conn.close();
            this.ep = null;
            this.usbInt = null;
            this.conn = null;
        }
        if (this.callbackContext != null) {
            this.callbackContext.error("DisConnected");
            this.callbackContext = null;
        }
    }

    public synchronized void cutPaper(int n) {
        byte[] bits = new byte[4];
        bits[0] = 29;
        bits[1] = 86;
        bits[2] = 66;
        bits[3] = ((byte) n);
        sendByte(bits);
    }

    public synchronized void catPaperByMode(int mode) {
        byte[] bits = new byte[3];
        switch (mode) {
        case 0:
            bits[0] = 29;
            bits[1] = 86;
            bits[2] = 48;
            break;
        case 1:
            bits[0] = 29;
            bits[1] = 86;
            bits[2] = 49;
            break;
        }
        sendByte(bits);
    }

    public synchronized void openCashBox() {
        byte[] bits = new byte[5];
        bits[0] = 27;
        bits[1] = 112;
        bits[2] = 0;
        bits[3] = 64;
        bits[4] = 80;
        sendByte(bits);
    }

    public synchronized void defaultBuzzer() {
        byte[] bits = new byte[4];
        bits[0] = 27;
        bits[1] = 66;
        bits[2] = 4;
        bits[3] = 1;
        sendByte(bits);
    }

    public synchronized void buzzer(int n, int time) {
        byte[] bits = new byte[4];
        bits[0] = 27;
        bits[1] = 66;
        bits[2] = ((byte) n);
        bits[3] = ((byte) time);
        sendByte(bits);
    }

    public synchronized void setBuzzerMode(int n, int time, int mode) {
        byte[] bits = new byte[5];
        bits[0] = 27;
        bits[1] = 67;
        bits[2] = ((byte) n);
        bits[3] = ((byte) time);
        bits[4] = ((byte) mode);
        sendByte(bits);
    }

    public synchronized void sendMsg(String msg, String charset) {
        if (msg.length() == 0) {
            return;
        }
        byte[] send;
        try {
            send = msg.getBytes(charset);
        } catch (UnsupportedEncodingException e) {
            send = msg.getBytes();
        }
        sendByte(new byte[] { 0x1B, 0x21, 0x08});
       
        sendByte(new byte[] { 0x1B, 0x21, 0x08});  // reduice height size
        sendByte(new byte[] { 0x1B, 0x61, 0x01});  
          //reduice width  sendByte(new byte[] { 0x1B, 0x21, 0x01});
          sendByte(new byte[] { 0x1B, 0x21, 0x08}); // reduice height size
         sendByte(new byte[] { 0x1B, 0x21, 0x01}); 
        sendByte(send);
        sendByte(new byte[] { 13, 10 });
    }
    
     public synchronized void sendTotal(String msg, String charset) {
           byte LINE_FEED = 0x0A;
            byte[] CHAR_SIZE_08 = { 0x1B, 0x21, 0x08 };
           byte[] ESC_ALIGN_RIGHT = { 0x1B, 0x61, 0x02 };
           byte[] CHAR_SIZE_10 = { 0x1B, 0x21, 0x10 };// Double height size
        if (msg.length() == 0) {
            return;
        }
        byte[] send;
        try {
            send = msg.getBytes(charset);
        } catch (UnsupportedEncodingException e) {
            send = msg.getBytes();
        }
        sendByte(new byte[] { 0x0A});
        sendByte(new byte[] { 0x1B, 0x21, 0x08});
        sendByte(new byte[] { 0x1B, 0x61, 0x02});
        sendByte(new byte[] { 0x1B, 0x21, 0x10});
        sendByte(new byte[] { 0x1B, 0x21, 0x01}); //reduice width
         sendByte(new byte[] { 0x1B, 0x21, 0x08}); // reduice height size
         sendByte(new byte[] { 0x1B, 0x21, 0x01}); 
        sendByte(send);
        sendByte(new byte[] { 13, 10 });
    }

     public synchronized void sendTitle(String msg, String charset, byte[] position) {
         //  sendByte(position);
        if (msg.length() == 0) {
            return;
        }
        byte[] send;
        try {
            send = msg.getBytes(charset);
        } catch (UnsupportedEncodingException e) {
            send = msg.getBytes();
        } 
        
        sendByte(new byte[] {0x1B, 0x61, 0x01});
         sendByte(new byte[] {0x1B, 0x21, 0x00});
         sendByte(new byte[] { 0x1B, 0x21, 0x01}); //reduice width
        sendByte(new byte[] { 0x1B, 0x21, 0x08}); // reduice height size
         sendByte(new byte[] { 0x1B, 0x21, 0x01}); 
        sendByte(send);
        sendByte(new byte[] { 13, 10 });
    }
   

     public synchronized void sendImage(byte[] msg, byte[] charset) {
     sendByte(charset);
     sendByte(msg);
     // sendByte(new byte[] { 13, 10 });
    // byte[] msg2 = new byte[] { 13, 10 };
    byte[] send;
        try {
            send = "msg test maeri print".getBytes("GBK");
        } catch (UnsupportedEncodingException e) {
            send = "msg test maeri print".getBytes();
        }
     //this.conn.bulkTransfer(this.ep, send, send.length, 0); 
      this.ep = null;
      this.usbInt = null;
      this.conn = null;
      
    }

      public synchronized void maeriBythes(byte[] msg, byte[] charset) {
     sendByte(charset);
     sendByte(msg);
    
    byte[] send;
        try {
            send = "msg test maeri print".getBytes("GBK");
        } catch (UnsupportedEncodingException e) {
            send = "msg test maeri print".getBytes();
        }
     //this.conn.bulkTransfer(this.ep, send, send.length, 0); sendByte
      this.ep = null;
      this.usbInt = null;
      this.conn = null;
      
    }

   

    public void sendByte(byte[] bits) {
        if (bits == null) {
            return;
        }
        if ((this.ep != null) && (this.usbInt != null) && (this.conn != null)) {
            this.conn.bulkTransfer(this.ep, bits, bits.length, 0);
        } else {
            if (this.conn == null) {
                this.conn = this.usbManager.openDevice(this.device);
            }
            if (this.device.getInterfaceCount() == 0) {
                return;
            }
            this.usbInt = this.device.getInterface(0);
            if (this.usbInt.getEndpointCount() == 0) {
                return;
            }
            for (int i = 0; i < this.usbInt.getEndpointCount(); i++) {
                if ((this.usbInt.getEndpoint(i).getType() == 2) && (this.usbInt.getEndpoint(i).getDirection() != 128)) {
                    this.ep = this.usbInt.getEndpoint(i);
                }
            }
            if (this.conn.claimInterface(this.usbInt, true)) {
                this.conn.bulkTransfer(this.ep, bits, bits.length, 0);
            }
        }
    }
}