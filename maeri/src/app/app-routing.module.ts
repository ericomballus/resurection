import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'Login',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    // import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'register',

    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'start',

    loadChildren: () =>
      import('./start/start.module').then((m) => m.StartPageModule),
  },

  {
    path: 'product-pack',

    loadChildren: () =>
      import('./product-pack/product-pack.module').then(
        (m) => m.ProductPackPageModule
      ),
  },
  {
    path: 'shop',

    loadChildren: () =>
      import('./shop/shop.module').then((m) => m.ShopPageModule),
  },
  {
    path: 'product-update',

    loadChildren: () =>
      import('./product-update/product-update.module').then(
        (m) => m.ProductUpdatePageModule
      ),
  },
  {
    path: 'product-item-add',

    loadChildren: () =>
      import('./product-item-add/product-item-add.module').then(
        (m) => m.ProductItemAddPageModule
      ),
  },
  {
    path: 'product-item-modal',
    loadChildren: () =>
      import('./product-item-modal/product-item-modal.module').then(
        (m) => m.ProductItemModalPageModule
      ),
  },
  {
    path: 'cart',

    loadChildren: () =>
      import('./cart/cart.module').then((m) => m.CartPageModule),
  },
  {
    path: 'product-pack-item-add',

    loadChildren: () =>
      import('./product-pack-item-add/product-pack-item-add.module').then(
        (m) => m.ProductPackItemAddPageModule
      ),
  },

  {
    path: 'product-pack-item-modal',
    loadChildren: () =>
      import('./product-pack-item-modal/product-pack-item-modal.module').then(
        (m) => m.ProductPackItemModalPageModule
      ),
  },
  {
    path: 'employee-add',
    loadChildren: () =>
      import('./employees/employee-add/employee-add.module').then(
        (m) => m.EmployeeAddPageModule
      ),
  },
  {
    path: 'category',

    loadChildren: () =>
      import('./category/category.module').then((m) => m.CategoryPageModule),
  },
  {
    path: 'admin-page',

    loadChildren: () =>
      import('./admin-page/admin-page.page.module').then(
        (m) => m.AdminPagePageModule
      ),
  },
  {
    path: 'customer-modal',

    loadChildren: () =>
      import('./customer-modal/customer-modal.module').then(
        (m) => m.CustomerModalPageModule
      ),
  },
  {
    path: 'database',
    loadChildren: () =>
      import('./database/database.module').then((m) => m.DatabasePageModule),
  },
  {
    path: 'disproduct',
    loadChildren: () =>
      import('./start/disproduct/disproduct.module').then(
        (m) => m.DisproductPageModule
      ),
  },
  {
    path: 'admin-config',
    loadChildren: () =>
      import('./admin-page/admin-config/admin-config.module').then(
        (m) => m.AdminConfigPageModule
      ),
  },
  {
    path: 'point-of-sale',
    loadChildren: () =>
      import('./point-of-sale/point-of-sale.module').then(
        (m) => m.PointOfSalePageModule
      ),
  },
  {
    path: 'employees-list',
    loadChildren: () =>
      import('./employees/employees-list/employees-list.module').then(
        (m) => m.EmployeesListPageModule
      ),
  },
  {
    path: 'employees-view-update',

    loadChildren: () =>
      import(
        './employees/employees-view-update/employees-view-update.module'
      ).then((m) => m.EmployeesViewUpdatePageModule),
  },

  {
    path: 'product-add',

    loadChildren: () =>
      import('./product/product-add/product-add.module').then(
        (m) => m.ProductAddPageModule
      ),
  },
  {
    path: 'product-list',
    loadChildren: () =>
      import('./product/product-list/product-list.module').then(
        (m) => m.ProductListPageModule
      ),
  },
  {
    path: 'product-pack-item-details',

    loadChildren: () =>
      import(
        './product/product-pack-item-details/product-pack-item-details.module'
      ).then((m) => m.ProductPackItemDetailsPageModule),
  },
  {
    path: 'product-manufactured',

    loadChildren: () =>
      import('./product/product-manufactured/product-manufactured.module').then(
        (m) => m.ProductManufacturedPageModule
      ),
  },
  {
    path: 'product-manufactured-item-add',

    loadChildren: () =>
      import(
        './product/product-manufactured-item-add/product-manufactured-item-add.module'
      ).then((m) => m.ProductManufacturedItemAddPageModule),
  },
  {
    path: 'invoice-paie',
    loadChildren: () =>
      import('./invoice-paie/invoice-paie.module').then(
        (m) => m.InvoicePaiePageModule
      ),
  },
  {
    path: 'product-item-list',

    loadChildren: () =>
      import('./product-item-list/product-item-list.module').then(
        (m) => m.ProductItemListPageModule
      ),
  },
  {
    path: 'warehouse',

    loadChildren: () =>
      import('./wharehouse/wharehouse.module').then(
        (m) => m.WharehousePageModule
      ),
  },
  {
    path: 'procurment-product-item',
    loadChildren: () =>
      import(
        './point-of-sale/procurment-product-item/procurment-product-item.module'
      ).then((m) => m.ProcurmentProductItemPageModule),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./point-of-sale/details/details.module').then(
        (m) => m.DetailsPageModule
      ),
  },
  {
    path: 'product-buy',

    loadChildren: () =>
      import('./product-buy/product-buy.module').then(
        (m) => m.ProductBuyPageModule
      ),
  },
  {
    path: 'commande',

    loadChildren: () =>
      import('./commande/commande.module').then((m) => m.CommandePageModule),
  },
  {
    path: 'employees-update-password',
    loadChildren: () =>
      import(
        './employees/employees-update-password/employees-update-password.module'
      ).then((m) => m.EmployeesUpdatePasswordPageModule),
  },
  {
    path: 'company',

    loadChildren: () =>
      import('./company/company.module').then((m) => m.CompanyPageModule),
  },
  {
    path: 'invoice-details',

    loadChildren: () =>
      import('./invoice-details/invoice-details.module').then(
        (m) => m.InvoiceDetailsPageModule
      ),
  },
  {
    path: 'confim-order',
    loadChildren: () =>
      import('./confim-order/confim-order.module').then(
        (m) => m.ConfimOrderPageModule
      ),
  },
  {
    path: 'activitie',

    loadChildren: () =>
      import('./activitie/activitie.module').then((m) => m.ActivitiePageModule),
  },
  {
    path: 'sale-per-day',

    loadChildren: () =>
      import('./sale-per-day/sale-per-day.module').then(
        (m) => m.SalePerDayPageModule
      ),
  },
  {
    path: 'admin-products',
    loadChildren: () =>
      import('./admin-page/admin-products/admin-products.module').then(
        (m) => m.AdminProductsPageModule
      ),
  },
  {
    path: 'admin-products-add',
    loadChildren: () =>
      import('./admin-page/admin-products-add/admin-products-add.module').then(
        (m) => m.AdminProductsAddPageModule
      ),
  },

  {
    path: 'admin-products-categorie',
    loadChildren: () =>
      import(
        './admin-page/admin-products-categorie/admin-products-categorie.module'
      ).then((m) => m.AdminProductsCategoriePageModule),
  },
  {
    path: 'pick-product',

    loadChildren: () =>
      import('./pick-product/pick-product.module').then(
        (m) => m.PickProductPageModule
      ),
  },
  {
    path: 'resource',

    loadChildren: () =>
      import('./resource/resource.module').then((m) => m.ResourcePageModule),
  },
  {
    path: 'product-resource-item',
    loadChildren: () =>
      import('./product-resource-item/product-resource-item.module').then(
        (m) => m.ProductResourceItemPageModule
      ),
  },
  {
    path: 'pick-resource',

    loadChildren: () =>
      import('./pick-resource/pick-resource.module').then(
        (m) => m.PickResourcePageModule
      ),
  },
  {
    path: 'product-resource-update',

    loadChildren: () =>
      import('./product-resource-update/product-resource-update.module').then(
        (m) => m.ProductResourceUpdatePageModule
      ),
  },
  {
    path: 'display-resource',

    loadChildren: () =>
      import('./display-resource/display-resource.module').then(
        (m) => m.DisplayResourcePageModule
      ),
  },
  {
    path: 'monitoring',

    loadChildren: () =>
      import('./monitoring/monitoring.module').then(
        (m) => m.MonitoringPageModule
      ),
  },
  {
    path: 'print-config',

    loadChildren: () =>
      import('./print-config/print-config.module').then(
        (m) => m.PrintConfigPageModule
      ),
  },
  {
    path: 'admin-product-update',
    loadChildren: () =>
      import(
        './admin-page/admin-product-update/admin-product-update.module'
      ).then((m) => m.AdminProductUpdatePageModule),
  },
  {
    path: 'admin-products-made',

    loadChildren: () =>
      import('./admin-products-made/admin-products-made.module').then(
        (m) => m.AdminProductsMadePageModule
      ),
  },
  {
    path: 'admin-products-madeby',

    loadChildren: () =>
      import(
        './admin-page/admin-products-made/admin-products-made.module'
      ).then((m) => m.AdminProductsMadePageModule),
  },
  {
    path: 'manageitems',
    loadChildren: () =>
      import('./point-of-sale/manageitems/manageitems.module').then(
        (m) => m.ManageitemsPageModule
      ),
  },
  {
    path: 'product-manufactured-user',
    loadChildren: () =>
      import(
        './product/product-manufactured-user/product-manufactured-user.module'
      ).then((m) => m.ProductManufacturedUserPageModule),
  },
  {
    path: 'purchase',

    loadChildren: () =>
      import('./purchase/purchase.module').then((m) => m.PurchasePageModule),
  },
  {
    path: 'invoice-unpaid',

    loadChildren: () =>
      import('./invoice-unpaid/invoice-unpaid.module').then(
        (m) => m.InvoiceUnpaidPageModule
      ),
  },
  {
    path: 'invoice-halfpaid',

    loadChildren: () =>
      import('./invoice-halfpaid/invoice-halfpaid.module').then(
        (m) => m.InvoiceHalfpaidPageModule
      ),
  },
  {
    path: 'invoice-cancel',

    loadChildren: () =>
      import('./invoice-cancel/invoice-cancel.module').then(
        (m) => m.InvoiceCancelPageModule
      ),
  },
  {
    path: 'cancel-order',

    loadChildren: () =>
      import('./point-of-sale/cancel-order/cancel-order.module').then(
        (m) => m.CancelOrderPageModule
      ),
  },
  {
    path: 'display-invoice',
    loadChildren: () =>
      import('./display-invoice/display-invoice.module').then(
        (m) => m.DisplayInvoicePageModule
      ),
  },
  {
    path: 'product-manufactured-manage',
    loadChildren: () =>
      import(
        './product/product-manufactured-manage/product-manufactured-manage.module'
      ).then((m) => m.ProductManufacturedManagePageModule),
  },
  {
    path: 'product-manufactured-buy',
    loadChildren: () =>
      import(
        './product/product-manufactured-buy/product-manufactured-buy.module'
      ).then((m) => m.ProductManufacturedBuyPageModule),
  },
  {
    path: 'category-super',
    loadChildren: () =>
      import('./category-super/category-super.module').then(
        (m) => m.CategorySuperPageModule
      ),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./billard/billard.module').then((m) => m.BillardPageModule),
  },
  {
    path: 'billard-add',
    loadChildren: () =>
      import('./billard-add/billard-add.module').then(
        (m) => m.BillardAddPageModule
      ),
  },
  {
    path: 'ajouteemploye',

    loadChildren: () =>
      import('./ajouteemploye/ajouteemploye.module').then(
        (m) => m.AjouteemployePageModule
      ),
  },
  {
    path: 'plat-list',
    loadChildren: () =>
      import('./plat-list/plat-list.module').then((m) => m.PlatListPageModule),
  },
  {
    path: 'bill',

    loadChildren: () =>
      import('./bill/bill.module').then((m) => m.BillPageModule),
  },
  {
    path: 'bill/:own',
    loadChildren: () =>
      import('./bill/bill.module').then((m) => m.BillPageModule),
  },
  {
    path: 'update-order',
    loadChildren: () =>
      import('./update-order/update-order.module').then(
        (m) => m.UpdateOrderPageModule
      ),
  },
  {
    path: 'display-inventaire',
    loadChildren: () =>
      import('./display-inventaire/display-inventaire.module').then(
        (m) => m.DisplayInventairePageModule
      ),
  },
  {
    path: 'before-inventory',
    loadChildren: () =>
      import('./before-inventory/before-inventory.module').then(
        (m) => m.BeforeInventoryPageModule
      ),
  },
  {
    path: 'poslive',
    loadChildren: () =>
      import('./poslive/poslive.module').then((m) => m.PoslivePageModule),
  },
  {
    path: 'add-vendor',
    loadChildren: () =>
      import('./pages/add-vendor/add-vendor.module').then(
        (m) => m.AddVendorPageModule
      ),
  },
  {
    path: 'vendors',
    loadChildren: () =>
      import('./pages/vendors/vendors.module').then((m) => m.VendorsPageModule),
  },
  {
    path: 'vendor-shop',
    loadChildren: () =>
      import('./pages/vendor-shop/vendor-shop.module').then(
        (m) => m.VendorShopPageModule
      ),
  },
  {
    path: 'vendor-cart',
    loadChildren: () =>
      import('./pages/vendor-cart/vendor-cart.module').then(
        (m) => m.VendorCartPageModule
      ),
  },
  {
    path: 'vendor-start',
    loadChildren: () =>
      import('./pages/vendor-start/vendor-start.module').then(
        (m) => m.VendorStartPageModule
      ),
  },
  {
    path: 'vendor-orders',
    loadChildren: () =>
      import('./pages/vendor-orders/vendor-orders.module').then(
        (m) => m.VendorOrdersPageModule
      ),
  },
  {
    path: 'vendor-modal',
    loadChildren: () =>
      import('./pages/vendor-modal/vendor-modal.module').then(
        (m) => m.VendorModalPageModule
      ),
  },
  {
    path: 'retailer-order',
    loadChildren: () =>
      import('./pages/retailer-order/retailer-order.module').then(
        (m) => m.RetailerOrderPageModule
      ),
  },
  {
    path: 'vendor-retailer-list',
    loadChildren: () =>
      import('./pages/vendor-retailer-list/vendor-retailer-list.module').then(
        (m) => m.VendorRetailerListPageModule
      ),
  },
  {
    path: 'vendor-retailer-products',
    loadChildren: () =>
      import(
        './pages/vendor-retailer-products/vendor-retailer-products.module'
      ).then((m) => m.VendorRetailerProductsPageModule),
  },
  {
    path: 'vendor-order-proposal',
    loadChildren: () =>
      import('./pages/vendor-order-proposal/vendor-order-proposal.module').then(
        (m) => m.VendorOrderProposalPageModule
      ),
  },
  {
    path: 'retailer-display-order-proposal',
    loadChildren: () =>
      import(
        './pages/retailer-display-order-proposal/retailer-display-order-proposal.module'
      ).then((m) => m.RetailerDisplayOrderProposalPageModule),
  },
  {
    path: 'retailer-modal',
    loadChildren: () =>
      import('./pages/retailer-modal/retailer-modal.module').then(
        (m) => m.RetailerModalPageModule
      ),
  },
  {
    path: 'consigne',
    loadChildren: () =>
      import('./pages/consigne/consigne.module').then(
        (m) => m.ConsignePageModule
      ),
  },
  {
    path: 'add-product-list',
    loadChildren: () =>
      import('./product/add-product-list/add-product-list.module').then(
        (m) => m.AddProductListPageModule
      ),
  },
  {
    path: 'refueling',
    loadChildren: () =>
      import('./modals/refueling/refueling.module').then(
        (m) => m.RefuelingPageModule
      ),
  },
  {
    path: 'admin-display-custumers',
    loadChildren: () =>
      import(
        './admin-page/admin-display-custumers/admin-display-custumers.module'
      ).then((m) => m.AdminDisplayCustumersPageModule),
  },
  {
    path: 'ravitaillement',
    loadChildren: () =>
      import('./ravitaillement/ravitaillement.module').then(
        (m) => m.RavitaillementPageModule
      ),
  },
  {
    path: 'createstore',
    loadChildren: () =>
      import('./pages/createstore/createstore.module').then(
        (m) => m.CreatestorePageModule
      ),
  },
  {
    path: 'updatestore',
    loadChildren: () =>
      import('./pages/updatestore/updatestore.module').then(
        (m) => m.UpdatestorePageModule
      ),
  },
  {
    path: 'build-display-inventory',
    loadChildren: () =>
      import(
        './pages/build-display-inventory/build-display-inventory.module'
      ).then((m) => m.BuildDisplayInventoryPageModule),
  },
  {
    path: 'display-sale',
    loadChildren: () =>
      import('./pages/display-sale/display-sale.module').then(
        (m) => m.DisplaySalePageModule
      ),
  },
  {
    path: 'inventaire-list',
    loadChildren: () =>
      import('./pages/inventaire-list/inventaire-list.module').then(
        (m) => m.InventaireListPageModule
      ),
  },
  {
    path: 'user-add-own-product',
    loadChildren: () =>
      import('./user-add-own-product/user-add-own-product.module').then(
        (m) => m.UserAddOwnProductPageModule
      ),
  },
  {
    path: 'admin-display-collections',
    loadChildren: () =>
      import(
        './admin-display-collections/admin-display-collections.module'
      ).then((m) => m.AdminDisplayCollectionsPageModule),
  },
  {
    path: 'add-cocktail',
    loadChildren: () =>
      import('./add-cocktail/add-cocktail.module').then(
        (m) => m.AddCocktailPageModule
      ),
  },
  {
    path: 'store-customer',
    loadChildren: () =>
      import('./pages/store-customer/store-customer.module').then(
        (m) => m.StoreCustomerPageModule
      ),
  },
  {
    path: 'add-store-customer',
    loadChildren: () =>
      import('./pages/add-store-customer/add-store-customer.module').then(
        (m) => m.AddStoreCustomerPageModule
      ),
  },
  {
    path: 'update-store-customer',
    loadChildren: () =>
      import('./pages/update-store-customer/update-store-customer.module').then(
        (m) => m.UpdateStoreCustomerPageModule
      ),
  },
  {
    path: 'pick-customer',
    loadChildren: () =>
      import('./pages/pick-customer/pick-customer.module').then(
        (m) => m.PickCustomerPageModule
      ),
  },
  {
    path: 'display-store-customer',
    loadChildren: () =>
      import(
        './pages/display-store-customer/display-store-customer.module'
      ).then((m) => m.DisplayStoreCustomerPageModule),
  },
  {
    path: 'shop-list',
    loadChildren: () =>
      import('./shop-list/shop-list.module').then((m) => m.ShopListPageModule),
  },
  {
    path: 'shop-list-add',
    loadChildren: () =>
      import('./shop-list-add/shop-list-add.module').then(
        (m) => m.ShopListAddPageModule
      ),
  },
  {
    path: 'billard-update',
    loadChildren: () =>
      import('./billard-update/billard-update.module').then(
        (m) => m.BillardUpdatePageModule
      ),
  },
  {
    path: 'shop-list-update',
    loadChildren: () =>
      import('./shop-list-update/shop-list-update.module').then(
        (m) => m.ShopListUpdatePageModule
      ),
  },
  {
    path: 'ravitaille',
    loadChildren: () =>
      import('./pages/ravitaille/ravitaille.module').then(
        (m) => m.RavitaillePageModule
      ),
  },
  {
    path: 'add-employee-retailer',
    loadChildren: () =>
      import(
        './employees/add-employee-retailer/add-employee-retailer.module'
      ).then((m) => m.AddEmployeeRetailerPageModule),
  },
  {
    path: 'employee-retailer-list',
    loadChildren: () =>
      import(
        './employees/employee-retailer-list/employee-retailer-list.module'
      ).then((m) => m.EmployeeRetailerListPageModule),
  },
  {
    path: 'employee-retailer-product-add',
    loadChildren: () =>
      import(
        './employees/employee-retailer-product-add/employee-retailer-product-add.module'
      ).then((m) => m.EmployeeRetailerProductAddPageModule),
  },
  {
    path: 'employees-retailer-sale',
    loadChildren: () =>
      import(
        './pages/employees-retailer-sale/employees-retailer-sale.module'
      ).then((m) => m.EmployeesRetailerSalePageModule),
  },
  {
    path: 'employee-retailer-invoices',
    loadChildren: () =>
      import(
        './employees/employee-retailer-invoices/employee-retailer-invoices.module'
      ).then((m) => m.EmployeeRetailerInvoicesPageModule),
  },
  {
    path: 'add-consigne',
    loadChildren: () =>
      import('./pages/add-consigne/add-consigne.module').then(
        (m) => m.AddConsignePageModule
      ),
  },
  {
    path: 'consigne-display',
    loadChildren: () =>
      import('./pages/consigne-display/consigne-display.module').then(
        (m) => m.ConsigneDisplayPageModule
      ),
  },
  {
    path: 'pick-employee-retailer',
    loadChildren: () =>
      import(
        './employees/pick-employee-retailer/pick-employee-retailer.module'
      ).then((m) => m.PickEmployeeRetailerPageModule),
  },
  {
    path: 'before-print',
    loadChildren: () =>
      import('./point-of-sale/before-print/before-print.module').then(
        (m) => m.BeforePrintPageModule
      ),
  },
  {
    path: 'store-customer-invoice',
    loadChildren: () =>
      import(
        './pages/store-customer-invoice/store-customer-invoice.module'
      ).then((m) => m.StoreCustomerInvoicePageModule),
  },
  {
    path: 'display-bonus-customer',
    loadChildren: () =>
      import(
        './pages/display-bonus-customer/display-bonus-customer.module'
      ).then((m) => m.DisplayBonusCustomerPageModule),
  },
  {
    path: 'gamme',
    loadChildren: () =>
      import('./gamme/gamme.module').then((m) => m.GammePageModule),
  },
  {
    path: 'delete-bill',
    loadChildren: () =>
      import('./pages/delete-bill/delete-bill.module').then(
        (m) => m.DeleteBillPageModule
      ),
  },
  {
    path: 'manager-display-bill',
    loadChildren: () =>
      import('./manager-display-bill/manager-display-bill.module').then(
        (m) => m.ManagerDisplayBillPageModule
      ),
  },
  {
    path: 'purchase-voucher',
    loadChildren: () =>
      import('./purchase-voucher/purchase-voucher.module').then(
        (m) => m.PurchaseVoucherPageModule
      ),
  },
  {
    path: 'bill-details',
    loadChildren: () =>
      import('./bill-details/bill-details.module').then(
        (m) => m.BillDetailsPageModule
      ),
  },
  {
    path: 'leader-list',
    loadChildren: () =>
      import('./pages/leader-list/leader-list.module').then(
        (m) => m.LeaderListPageModule
      ),
  },
  {
    path: 'leader-bonus',
    loadChildren: () =>
      import('./pages/leader-bonus/leader-bonus.module').then(
        (m) => m.LeaderBonusPageModule
      ),
  },
  {
    path: 'super-manager',
    loadChildren: () =>
      import('./super-manager/super-manager.module').then(
        (m) => m.SuperManagerPageModule
      ),
  },
  {
    path: 'manager-refueling',
    loadChildren: () =>
      import('./manager-refueling/manager-refueling.module').then(
        (m) => m.ManagerRefuelingPageModule
      ),
  },
  {
    path: 'fiche-pointage',
    loadChildren: () =>
      import('./pages/fiche-pointage/fiche-pointage.module').then(
        (m) => m.FichePointagePageModule
      ),
  },
  {
    path: 'fiche-list',
    loadChildren: () =>
      import('./pages/fiche-list/fiche-list.module').then(
        (m) => m.FicheListPageModule
      ),
  },
  {
    path: 'fiche-details',
    loadChildren: () =>
      import('./pages/fiche-details/fiche-details.module').then(
        (m) => m.FicheDetailsPageModule
      ),
  },
  {
    path: 'user-contrat',
    loadChildren: () =>
      import('./contrat/user-contrat/user-contrat.module').then(
        (m) => m.UserContratPageModule
      ),
  },
  {
    path: 'create-contrat',
    loadChildren: () =>
      import('./contrat/create-contrat/create-contrat.module').then(
        (m) => m.CreateContratPageModule
      ),
  },
  {
    path: 'list-contrat',
    loadChildren: () =>
      import('./contrat/list-contrat/list-contrat.module').then(
        (m) => m.ListContratPageModule
      ),
  },
  {
    path: 'update-contrat',
    loadChildren: () =>
      import('./contrat/update-contrat/update-contrat.module').then(
        (m) => m.UpdateContratPageModule
      ),
  },
  {
    path: 'confirm',
    loadChildren: () =>
      import('./modals/confirm/confirm.module').then(
        (m) => m.ConfirmPageModule
      ),
  },
  {
    path: 'sw-home',
    loadChildren: () =>
      import('./super-warehouse/sw-home/sw-home.module').then(
        (m) => m.SwHomePageModule
      ),
  },
  {
    path: 'sw-commandes',
    loadChildren: () =>
      import('./super-warehouse/sw-commandes/sw-commandes.module').then(
        (m) => m.SwCommandesPageModule
      ),
  },
  {
    path: 'sw-transaction',
    loadChildren: () =>
      import('./super-warehouse/sw-transaction/sw-transaction.module').then(
        (m) => m.SwTransactionPageModule
      ),
  },
  {
    path: 'sc-home',
    loadChildren: () =>
      import('./super-cashier/sc-home/sc-home.module').then(
        (m) => m.ScHomePageModule
      ),
  },
  {
    path: 'sc-commande',
    loadChildren: () =>
      import('./super-cashier/sc-commande/sc-commande.module').then(
        (m) => m.ScCommandePageModule
      ),
  },
  {
    path: 'sc-transaction',
    loadChildren: () =>
      import('./super-cashier/sc-transaction/sc-transaction.module').then(
        (m) => m.ScTransactionPageModule
      ),
  },
  {
    path: 'sw-display-commande',
    loadChildren: () =>
      import(
        './super-warehouse/sw-display-commande/sw-display-commande.module'
      ).then((m) => m.SwDisplayCommandePageModule),
  },
  {
    path: 'sc-shop',
    loadChildren: () =>
      import('./super-cashier/sc-shop/sc-shop.module').then(
        (m) => m.ScShopPageModule
      ),
  },
  {
    path: 'sc-display-stock',
    loadChildren: () =>
      import('./super-cashier/sc-display-stock/sc-display-stock.module').then(
        (m) => m.ScDisplayStockPageModule
      ),
  },
  {
    path: 'fc-home',
    loadChildren: () =>
      import('./facturation/fc-home/fc-home.module').then(
        (m) => m.FcHomePageModule
      ),
  },
  {
    path: 'purchase-confirm',
    loadChildren: () =>
      import('./purchase-confirm/purchase-confirm.module').then(
        (m) => m.PurchaseConfirmPageModule
      ),
  },
  {
    path: 'store-customer-balance',
    loadChildren: () =>
      import(
        './pages/store-customer-balance/store-customer-balance.module'
      ).then((m) => m.StoreCustomerBalancePageModule),
  },
  {
    path: 'sa-home',
    loadChildren: () =>
      import('./super-admin-manager/sa-home/sa-home.module').then(
        (m) => m.SaHomePageModule
      ),
  },
  {
    path: 'zone-expedition',
    loadChildren: () =>
      import('./modals/zone-expedition/zone-expedition.module').then(
        (m) => m.ZoneExpeditionPageModule
      ),
  },
  {
    path: 'add-expense',
    loadChildren: () =>
      import('./expenses/add-expense/add-expense.module').then(
        (m) => m.AddExpensePageModule
      ),
  },
  {
    path: 'list-expense',
    loadChildren: () =>
      import('./expenses/list-expense/list-expense.module').then(
        (m) => m.ListExpensePageModule
      ),
  },
  {
    path: 'categorie-expense',
    loadChildren: () =>
      import('./expenses/categorie-expense/categorie-expense.module').then(
        (m) => m.CategorieExpensePageModule
      ),
  },
  {
    path: 'home-expense',
    loadChildren: () =>
      import('./expenses/home-expense/home-expense.module').then(
        (m) => m.HomeExpensePageModule
      ),
  },
  {
    path: 'makechange',
    loadChildren: () =>
      import('./modals/makechange/makechange.module').then(
        (m) => m.MakechangePageModule
      ),
  },
  {
    path: 'store-list',
    loadChildren: () =>
      import('./modals/store-list/store-list.module').then(
        (m) => m.StoreListPageModule
      ),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./contrat/details/details.module').then(
        (m) => m.DetailsPageModule
      ),
  },
  {
    path: 'contrat-details',
    loadChildren: () =>
      import('./contrat/contrat-details/contrat-details.module').then(
        (m) => m.ContratDetailsPageModule
      ),
  },
  {
    path: 'patient-list',
    loadChildren: () =>
      import('./hospital/patient-list/patient-list.module').then(
        (m) => m.PatientListPageModule
      ),
  },
  {
    path: 'patient-add',
    loadChildren: () =>
      import('./hospital/patient-add/patient-add.module').then(
        (m) => m.PatientAddPageModule
      ),
  },
  {
    path: 'patient-parameter',
    loadChildren: () =>
      import('./hospital/patient-parameter/patient-parameter.module').then(
        (m) => m.PatientParameterPageModule
      ),
  },
  {
    path: 'patient-ordonnance',
    loadChildren: () =>
      import('./hospital/patient-ordonnance/patient-ordonnance.module').then(
        (m) => m.PatientOrdonnancePageModule
      ),
  },

  {
    path: 'hospital-home',
    loadChildren: () =>
      import('./hospital/hospital-home/hospital-home.module').then(
        (m) => m.HospitalHomePageModule
      ),
  },  {
    path: 'patient-detail',
    loadChildren: () => import('./hospital/patient-detail/patient-detail.module').then( m => m.PatientDetailPageModule)
  },
  {
    path: 'select-patient',
    loadChildren: () => import('./hospital/select-patient/select-patient.module').then( m => m.SelectPatientPageModule)
  },
  {
    path: 'patient-profile',
    loadChildren: () => import('./hospital/patient-profile/patient-profile.module').then( m => m.PatientProfilePageModule)
  },
  {
    path: 'hospitalisation-add',
    loadChildren: () => import('./hospital/hospitalisation-add/hospitalisation-add.module').then( m => m.HospitalisationAddPageModule)
  },
  {
    path: 'pick-date-time',
    loadChildren: () => import('./modals/pick-date-time/pick-date-time.module').then( m => m.PickDateTimePageModule)
  },
  {
    path: 'select-stock',
    loadChildren: () => import('./modals/select-stock/select-stock.module').then( m => m.SelectStockPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
