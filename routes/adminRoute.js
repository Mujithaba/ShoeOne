const express = require('express')
const admin_route = express()


const adminController = require('../controllers/adminController')
const orderController = require('../controllers/orderController')
const upload = require('../multer')

const auth=require('../middleware/adminAuth')
// app.set('views', './views/admin')

// admin login route
admin_route.get('/',auth.isLogout, adminController.loadlogin) 
admin_route.post('/', adminController.verifyLogin)

// dashboard route
admin_route.get('/dashboard', auth.isLogin,adminController.loadDashboard)
admin_route.get('/dashboard-data',adminController.sendDashboardData)

// sales report
admin_route.get('/Sales-page-Date', auth.isLogin,adminController.LoadSalesPage)
admin_route.post('/salesReport',adminController.salesReportCollect)

// logout
admin_route.get('/logout',auth.isLogin,adminController.logout)
// blocking route
admin_route.patch('/block-user/:userID', adminController.userBlock)
admin_route.patch('/Unblock-user/:userID', adminController.userUnblock)

// customers details
admin_route.get('/customersList', auth.isLogin,adminController.LoadUserDetails)

// category
admin_route.get('/category', auth.isLogin,adminController.loadCategory)
admin_route.post('/add-category', adminController.addCategory)
admin_route.get('/edit-adcategory', auth.isLogin, adminController.editCategory)
admin_route.post('/update-category', adminController.updateCategory)
admin_route.patch('/list-cat/:catID', adminController.categoryList)
admin_route.patch('/Unlist-cat/:catID', adminController.categoryUnlist)

// product
admin_route.get('/product', auth.isLogin,adminController.productLoad)
admin_route.get('/add-product',auth.isLogin, adminController.addProductLoad)
admin_route.post('/uploadProduct', upload.array('Image', 4), adminController.uploadDetails)
admin_route.get('/edit-product', auth.isLogin, adminController.editProduct)
admin_route.post('/updateProduct', upload.array('Image', 4), adminController.updateProduct)
admin_route.patch('/list-product/:prodID', adminController.productList)
admin_route.patch('/Unlist-product/:prodID', adminController.productUnlist)

// user-orders details
admin_route.get('/user-Orders',auth.isLogin,adminController.loadUserorders)
admin_route.get('/order-info',auth.isLogin,adminController.loadOrders)
admin_route.post('/statusChange',adminController.changeStatus)

// coupon
admin_route.get('/couponAdmin',auth.isLogin,adminController.loadCoupon)
admin_route.get('/add-Coupon',auth.isLogin,adminController.addCouponLoad)
admin_route.post('/uploadAddCoupon',adminController.uploadCoupon)
admin_route.patch('/list-coupon/:couponID', adminController.couponList)
admin_route.patch('/Unlist-coupon/:couponID', adminController.couponUnlist)
admin_route.get('/edit-coupon',auth.isLogin,adminController.editCoupon)
admin_route.post('/updateEditCoupon',adminController.updatedCoupon)


// Offer
admin_route.get('/offerPage',adminController.offerLoad)
admin_route.get('/loadAddOffer',adminController.addOfferLoad)
admin_route.post('/uploadAddOffer',adminController.upolodOffer)
admin_route.patch('/list-offer/:offerID', adminController.offerList)
admin_route.patch('/Unlist-offer/:offerID', adminController.offerUnlist)
admin_route.post('/offerAddToProduct',adminController.settingOfferToProduct)
admin_route.post('/deleteOfferFromProduct',adminController.offerRemovedFromProduct)
admin_route.post('/offerAddToCategory',adminController.settingOfferToCategory)



module.exports = admin_route;
