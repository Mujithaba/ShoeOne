const express = require('express')
const user_route=express();




const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const wishlistController = require('../controllers/wishlistController')
const infoPageController = require('../controllers/infoPageContoller')
const auth=require('../middleware/auth')

// user_route.set('views', '/views')


// isblocked
user_route.get('/isBlocked',userController.loadIsBlocked)

// route for Registeration
user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',userController.insertUser)

// otp route
user_route.get('/OTPvarification',auth.isLogout,userController.loadOTP)
user_route.post('/OTPvarification',userController.verifyOTP)
user_route.get('/resend-otp',userController.resend)

// route for Login
user_route.get('/login',auth.isLogout,userController.loginLoad)
user_route.post('/login',userController.verifyLogin)
user_route.get('/logout',auth.isLogin,userController.logout)
// forget password
user_route.get('/forgetStep',auth.isLogout,userController.forgetLoad)
user_route.post('/forgotSendEmal',userController.emailverify)
user_route.get('/OTPverifyForForgot',userController.forgotOTPLoad)
user_route.post('/OTPforgot',userController.verifyOTPForgot)
user_route.post('/forgetPassword',userController.settingForgotPass)
user_route.get('/resendOTPforgotPass',userController.ForgotpassOTPresend)


// route to home
user_route.get('/',userController.openingHome)
user_route.get('/home',auth.isBlocked,auth.isLogin,userController.loadHome);  

// route shop
// user_route.get('/shop',auth.isBlocked,auth.isLogin,userController.loadShop)
user_route.get('/shop',userController.loadShop)
user_route.get('/productDetail',auth.isBlocked,auth.isLogin,userController.productDetailed)

// cart
user_route.get('/cart',auth.isBlocked,auth.isLogin,cartController.loadCart)
user_route.post('/addToCart',auth.isLogin,cartController.CreateCart)
user_route.post('/updateQuantity',cartController.updateQuantity)
user_route.delete('/removeProduct/:productId',cartController.deleteProduct)

// user profile
// user_route.get('/profile',auth.isBlocked,auth.isLogin,userController.loadProfile)
user_route.get('/profile',auth.isLogin,userController.loadProfile)

user_route.post('/passwordChange',userController.changepassword)
user_route.post('/addressAdd',userController.addAddressLoad)
user_route.post('/deleteAddress',userController.addressDelete)
user_route.get('/editAddress',auth.isBlocked,userController.loadEditAddress)
user_route.post('/updateAddress',userController.editSaveAddress)

user_route.get('/your-wallet',auth.isBlocked,auth.isLogin,orderController.walletLoad) // wallet

// checkout page
user_route.get('/checkout',auth.isBlocked,auth.isLogin,userController.loadCheckout)
user_route.post('/placeOrder',auth.isLogin,orderController.orderPlace)
user_route.post('/verifyOnlinePayment',orderController.verifyPayment)
user_route.get('/successOrder',auth.isBlocked,auth.isLogin,orderController.loadSuccessPlace)

// myorder
user_route.get('/my-Order',auth.isBlocked,auth.isLogin,orderController.loadMyOrder)
user_route.get('/views-Order',auth.isBlocked,auth.isLogin,orderController.loadViewOrder)
user_route.post('/cancelOrder',orderController.cancelOrder)
user_route.post('/returnOrder',orderController.returnOrder)
user_route.post('/invoiceDownloading',orderController.downloadInvoice)

// wishlist
user_route.get('/wishlist',auth.isLogin,wishlistController.loadWishlist)
user_route.post('/addwishlist',wishlistController.createWishlist)
user_route.delete('/removeProductFromWishlist/:productId',wishlistController.deleteProductFromWishlist)

// contact and about info
user_route.get('/about',auth.isBlocked,auth.isLogin,infoPageController.about)
user_route.get('/contact',auth.isBlocked,auth.isLogin,infoPageController.contact)


module.exports= user_route ;
