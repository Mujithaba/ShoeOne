const express = require('express')
const admin_route = express()


const adminController = require('../controllers/adminController')
const orderController = require('../controllers/orderController')
const offerController = require('../controllers/offersController')
const couponController = require('../controllers/couponController')
const categoryController = require('../controllers/categoryCintroller')
const productController = require('../controllers/productController')
const upload = require('../multer')
const auth=require('../middleware/adminAuth')


// admin login route
admin_route.get('/',auth.isLogout, adminController.loadlogin) 
admin_route.post('/', adminController.verifyLogin)

// dashboard route
admin_route.get('/dashboard', auth.isLogin,adminController.loadDashboard)
admin_route.get('/dashboard-data',adminController.sendDashboardData)

// sales report
admin_route.get('/Sales-page-Date', auth.isLogin,adminController.LoadSalesPage)
admin_route.post('/salesReport',adminController.salesReportCollect)
// admin_route.post('/saleReportinCSV',adminController.CSVDownloading)

// logout
admin_route.get('/logout',auth.isLogin,adminController.logout)
// blocking route
admin_route.patch('/block-user/:userID', adminController.userBlock)
admin_route.patch('/Unblock-user/:userID', adminController.userUnblock)
// customers details
admin_route.get('/customersList', auth.isLogin,adminController.LoadUserDetails)

// category
admin_route.get('/category', auth.isLogin,categoryController.loadCategory)
admin_route.post('/add-category', categoryController.addCategory)
admin_route.get('/edit-adcategory', auth.isLogin, categoryController.editCategory)
admin_route.post('/update-category', categoryController.updateCategory)
admin_route.patch('/list-cat/:catID', categoryController.categoryList)
admin_route.patch('/Unlist-cat/:catID', categoryController.categoryUnlist)

// product
admin_route.get('/product', auth.isLogin,productController.productLoad)
admin_route.get('/add-product',auth.isLogin, productController.addProductLoad)
admin_route.post('/uploadProduct', upload.array('Image', 4), productController.uploadDetails)
admin_route.get('/edit-product', auth.isLogin, productController.editProduct)
admin_route.post('/updateProduct', upload.array('Image', 4), productController.updateProduct)
admin_route.patch('/list-product/:prodID', productController.productList)
admin_route.patch('/Unlist-product/:prodID', productController.productUnlist)

// user-orders details
admin_route.get('/user-Orders',auth.isLogin,adminController.loadUserorders)
admin_route.get('/order-info',auth.isLogin,adminController.loadOrders)
admin_route.post('/statusChange',adminController.changeStatus)

// coupon
admin_route.get('/couponAdmin',auth.isLogin,couponController.loadCoupon)
admin_route.get('/add-Coupon',auth.isLogin,couponController.addCouponLoad)
admin_route.post('/uploadAddCoupon',couponController.uploadCoupon)
admin_route.patch('/list-coupon/:couponID', couponController.couponList)
admin_route.patch('/Unlist-coupon/:couponID', couponController.couponUnlist)
admin_route.get('/edit-coupon',auth.isLogin,couponController.editCoupon)
admin_route.post('/updateEditCoupon',couponController.updatedCoupon)


// Offer
admin_route.get('/offerPage',offerController.offerLoad)
admin_route.get('/loadAddOffer',offerController.addOfferLoad)
admin_route.post('/uploadAddOffer',offerController.upolodOffer)
admin_route.patch('/list-offer/:offerID', offerController.offerList)
admin_route.patch('/Unlist-offer/:offerID', offerController.offerUnlist)
admin_route.post('/offerAddToProduct',offerController.settingOfferToProduct)
admin_route.post('/deleteOfferFromProduct',offerController.offerRemovedFromProduct)
admin_route.post('/offerAddToCategory',offerController.settingOfferToCategory)
admin_route.post('/deleteOfferFromCategory',offerController.offerRemovedFromCategory)


module.exports = admin_route;
