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
// logout
admin_route.get('/logout',auth.isLogin,adminController.logout)

// customers details
admin_route.get('/customersList', auth.isLogin,adminController.LoadUserDetails)

// blocking route
admin_route.patch('/block-user/:userID', adminController.userBlock)
admin_route.patch('/Unblock-user/:userID', adminController.userUnblock)
// category
admin_route.get('/category', auth.isLogin,adminController.loadCategory)
admin_route.post('/add-category', adminController.addCategory)
// edit category
admin_route.get('/edit-adcategory', adminController.editCategory)
admin_route.post('/update-category', adminController.updateCategory)
// category list and unlist
admin_route.patch('/list-cat/:catID', adminController.categoryList)
admin_route.patch('/Unlist-cat/:catID', adminController.categoryUnlist)
// product
admin_route.get('/product', auth.isLogin,adminController.productLoad)

// add-product
admin_route.get('/add-product', adminController.addProductLoad)
admin_route.post('/uploadProduct', upload.array('Image', 4), adminController.uploadDetails)
// Edit-product
admin_route.get('/edit-product', adminController.editProduct)
admin_route.post('/updateProduct', upload.array('Image', 4), adminController.updateProduct)
// product list and unlist
admin_route.patch('/list-product/:prodID', adminController.productList)
admin_route.patch('/Unlist-product/:prodID', adminController.productUnlist)

// user-orders details
admin_route.get('/user-Orders',auth.isLogin,adminController.loadUserorders)
admin_route.get('/order-info',auth.isLogin,adminController.loadOrders)
admin_route.post('/statusChange',adminController.changeStatus)

// sales report
admin_route.get('/Sales-page-Date',adminController.LoadSalesPage)
admin_route.post('/salesReport',adminController.salesReportCollect)

module.exports = admin_route;
