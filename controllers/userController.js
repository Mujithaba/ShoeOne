const { model } = require('mongoose');
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const bcrypt = require('bcrypt')
// const crypto = require('crypto');
const sendMail = require('../services/OTPverification');
const sendMailForgot = require('../services/reset-password')
const { env } = require('process');
const randomstring = require('randomstring');
const productModel = require('../models/productModel');



function generateOTP() {

    return Math.floor(100000 + Math.random() * 900000);

}



// password hashing
const securePassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash

    } catch (error) {

        console.log(error.message);
    }
}



// user registeration 
const loadRegister = async (req, res) => {

    try {

        res.render('user/register')

    } catch (error) {
        console.log(error.message);
    }
}


const insertUser = async (req, res) => {

    try {
        const spassword = await securePassword(req.body.password)

        const emailExist = await User.findOne({ email: req.body.email })

        if (emailExist) {
            res.render('user/register', { message: "Email already exist ,Try another email..." })
        } else {

            const user = new User({

                firstName: req.body.Firstname,
                secondName: req.body.Secondname,
                email: req.body.email,
                mobile: req.body.mobile,
                password: spassword,
                is_verified: 0,
                is_admin: 0,
                is_blocked: 0
            });


            const userData = await user.save();


            if (userData) {
                const otp = generateOTP();

                console.log(otp);

                req.session.otp = otp;
                req.session.email = req.body.email;
                req.session.Firstname = req.body.Firstname
                sendMail(otp, req.session.email, req.session.Firstname);

                res.redirect('/OTPvarification')
            } else {
                res.render('user/register', { message: "You registration has been failed." })
            }
        }
    } catch (error) {
        console.log(error.message);

    }
}


// user loadOTP
const loadOTP = async (req, res) => {
    try {

        res.render('user/OTPverify');
    } catch (error) {
        console.log(error.message);
    }
}

// verifyOTP
const verifyOTP = async (req, res) => {
    try {
        const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body
        const enterOTP = otp1 + otp2 + otp3 + otp4 + otp5 + otp6
        const enteredOTP = parseInt(enterOTP)
        console.log(enteredOTP);

        const storedOTP = req.session.otp;

        if (storedOTP && enteredOTP === storedOTP) {

            const user = await User.findOne({ email: req.session.email });
            //  console.log(user);
            user.is_verified = 1;

            await user.save();

            delete req.session.otp;

            res.render('user/login', { message: "Signup is successfull." });
        } else {

            res.render('user/OTPverify', { message: "Incorrect OTP. Please try again." });
        }
    } catch (error) {
        console.log(error.message);
    }
}


const resend = async (req, res) => {
    try {
        // console.log("vannoooooooo");
        const otp = generateOTP();
        console.log(otp);
        req.session.otp = otp;
        sendMail(otp, req.session.email, req.session.Firstname);
        res.render('user/OTPverify', { msg: 'Resend otp is passed,check your mail' })


    } catch (error) {
        console.log(error.message);
    }
}



// user Login 
const loginLoad = async (req, res) => {

    try {
        res.render('user/login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });


        if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_blocked == false) {


                    if (userData.is_verified == 1) {

                        req.session.user_id = userData._id;
                        res.redirect('/home');

                    } else {

                        const otp = generateOTP();// not verified case
                        req.session.otp = otp;
                        req.session.email = req.body.email;
                        req.session.Firstname = userData.firstName
                        sendMail(otp, req.session.email, req.session.Firstname);

                        res.render('user/login', { verify: "Your are not verified, Verify before login" })

                    }
                } else {
                    res.render('user/login', { message: "Admin is blocked you ,So you can't login" })
                }

            } else {
                res.render('user/login', { message: "Password is incorrect" });
            }

        } else {
            res.render('user/login', { message: "Email  is incorrect" });
        }

    } catch (error) {
        console.log(error.message);
    }
}


// logout
const logout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}



// isBlocked
const loadIsBlocked = async (req, res) => {
    try {

        res.render('user/isBlocked')

    } catch (error) {
        console.log(error.message);
    }
}




// forget password setting start
const forgetLoad = async (req, res) => {
    try {

        res.render('user/forgetStep')

    } catch (error) {
        console.log(error.message);
    }
}

// verify mail
const emailverify = async (req, res) => {
    try {
        const userEmail = req.body.email
        console.log(userEmail);
        const userData = await User.findOne({ email: userEmail })
        console.log(userData);

        if (userData.is_verified === 0) {
            res.render('user/forgetStep', { message: "Please verify your mail" })
        } else {

            const otp = generateOTP();
            console.log(otp);
            req.session.otp = otp;
            req.session.email = req.body.email;
            req.session.Firstname = userData.firstName
            sendMailForgot(otp, req.session.email, req.session.Firstname);
            res.redirect('/OTPverifyForForgot')

        }
    } catch (error) {
        console.log(error.message);
    }
}

// forgot otp page
const forgotOTPLoad = async (req, res) => {
    try {

        res.render('user/forgotOTP');
    } catch (error) {
        console.log(error.message);
    }
}

// verify otp for forgot password
const verifyOTPForgot = async (req, res) => {
    try {
        console.log("forgot checking");
        const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body
        const enterOTP = otp1 + otp2 + otp3 + otp4 + otp5 + otp6
        const enteredOTP = parseInt(enterOTP)
        console.log(enteredOTP);

        const OTPstored = req.session.otp;

        if (OTPstored && enteredOTP === OTPstored) {

            delete req.session.otp;

            res.render('user/forgetPassword', { message: "Otp verification is successfull." });
        } else {

            res.render('user/forgotOTP', { message: "Incorrect OTP. Please try again." });
        }

    } catch (error) {
        console.log(error.message);
    }
}


// setting forgot password
const settingForgotPass = async (req, res) => {
    try {
        const userEmail = req.session.email
        const newPassword = req.body.password

        const secure_Password = await securePassword(newPassword)

        const setPassword = await User.findOneAndUpdate({ email: userEmail }, { $set: { password: secure_Password } })

        if (setPassword) {
            res.render('user/login', { message: "Password changed successfully" })
        } else {
            res.render('user/forgetPassword', { message: "something went wrong when you are changing password." })
        }


    } catch (error) {
        console.log(error.message);
    }
}

// resend forgot password otp
const ForgotpassOTPresend = async (req, res) => {
    try {
        // console.log("vannoooooooo");
        const otp = generateOTP();
        console.log(otp);
        req.session.otp = otp;
        sendMailForgot(otp, req.session.email, req.session.Firstname);
        res.render('user/forgotOTP', { msg: 'Resend otp is passed,check your mail' })


    } catch (error) {
        console.log(error.message);
    }
}

// forget password setting end






// count cart products 
const getCartItemCount = async (userId) => {
    try {
        const cartExist = await Cart.findOne({ userId });

        if (!cartExist) {
            return 0; // Cart is empty, so the count is 0
        } else {
            const itemCount = cartExist.products.length;
            return itemCount;
        }
    } catch (error) {
        console.log(error.message);
        return -1; // An error occurred
    }
};



// home method start
const openingHome = async (req, res) => {

    try {

        res.render('user/home')

    } catch (error) {
        console.log(error.message);
    }
}



const loadHome = async (req, res) => {
    try {
        // let userData = null;
        const user_id = req.session.user_id
        const  userData = await User.findById({ _id: user_id });

          // Get the cart count
          const cartItemCount = await getCartItemCount(user_id);

        
        res.render('user/home',{ cartItemCount });

    } catch (error) {
        console.log(error.message);
    }
}


// loading Shop
const loadShop = async (req, res) => {
    try {
        const user_id = req.session.user_id
          // Get the cart count
          const cartItemCount = await getCartItemCount(user_id);

        if (req.query.id) {

            const id = req.query.id
            // console.log(id);
            const fullProducts = await Product.find({ is_listed: true, category: id })
            // console.log(fullProducts);
            const category = await Category.find({ is_listed: true })
            // console.log(category);

            

            res.render('user/shop', { category, fullProducts ,cartItemCount})
        } else {

            const fullProducts = await Product.find({ is_listed: true })
            const category = await Category.find({ is_listed: true })
            res.render('user/shop', { category, fullProducts,cartItemCount })
        }


    } catch (error) {
        console.log(error.message);
    }
}


// productDetail Load
const productDetailed = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const productid = req.query.id

          // Get the cart count
          const cartItemCount = await getCartItemCount(user_id);

        // console.log(productid);
        const findProduct = await Product.findOne({ _id: productid }).populate('category');
        // console.log(findProduct.category.categoryName);
        const category = await Category.find({ is_listed: true })
        res.render('user/product-details', { category, findProduct ,cartItemCount })

    } catch (error) {
        console.log(error.message);
    }
}






// user profilepage load 
const loadProfile = async (req, res) => {

    try {
        const user_id = req.session.user_id

        const userData = await User.findById({ _id: user_id })
        const addressData = await Address.find({ userId: user_id })

          // Get the cart count
          const cartItemCount = await getCartItemCount(user_id);


        res.render('user/profile', { userData, addresses: addressData , cartItemCount})

    } catch (error) {
        console.log(error.message);
    }
}


// ChangePassword
const changepassword = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { currentPassword, newPassword, repeatPassword } = req.body;

        // taking the user id for comapre the password
        const user = await User.findById({ _id: userId })

        // comparing the currentpassword and entered current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password)

        if (passwordMatch) {
            const spassword = await securePassword(req.body.newPassword)
            const changePass = await User.findByIdAndUpdate(
                { '_id': userId },
                { $set: { 'password': spassword } },
                { new: true }
            )
            res.json({ message: "Password Changed Successfully" })

        } else {
            res.json({ msg: "Cannot Matched the Current Password" })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// addAddress method
const addAddressLoad = async (req, res) => {
    try {
        const user_id = req.session.user_id
        // console.log(user_id);
        const { addAddress } = req.body

        const userAddress = new Address({
            userId: user_id,
            fullname: addAddress.fullname,
            mobile: addAddress.mobno,
            address: addAddress.address,
            pincode: addAddress.pincode,
            city: addAddress.city,
            state: addAddress.state

        });
        await userAddress.save()
        // console.log(userAddress);
        res.json({ message: "Address added Successfully" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}



// delete address from address manager
const addressDelete = async (req, res) => {
    try {
        const addressid = req.body.addressId
        const delAddress = await Address.findByIdAndDelete({ _id: addressid })

        res.json({ message: "Address is deleted successfully" })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}



// edit address
const loadEditAddress = async (req, res) => {
    try {

        const addressId = req.query.id.trim();
        console.log(addressId + "hhh");

        const addressDetails = await Address.findById({ _id: addressId })
        console.log(addressDetails);

        res.render('user/Edit-Address', { addressDetails })

    } catch (error) {
        console.log(error.message);
    }
}




// Saving the edited address
const editSaveAddress = async (req, res) => {
    try {

        const addressId = req.body.addressID.trim()
        console.log(addressId);

  const addressData = await Address.findOneAndUpdate(
      {_id:addressId},
      {
        $set: {
          fullname: req.body.name,
          mobile: req.body.mobile,
          address: req.body.address,
          pincode: req.body.pincode,
          city: req.body.city,
          state: req.body.state,
        },
      },
      { new: true } // This option returns the modified document
    );
    if (addressData) {
        console.log('Updated document:', addressData);
        res.redirect('/profile');
      } else {
        console.log('Document not found or not updated.');
        res.status(404).send('Document not found or not updated.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }



// loadCheckout
const loadCheckout = async (req, res) => {
    try {

        const user_id = req.session.user_id
        // const userData = await User.findById({ _id: user_id })
          // Get the cart count
          const cartItemCount = await getCartItemCount(user_id);


        const addressData = await Address.find({ userId: user_id })
        const cartData = await Cart.findOne({ userId: user_id }).populate({
            path: 'products.productId',
            select: 'Price productName stock'
        })



        // calculating total price for place order
        const cartTotal = cartData.products.reduce((acc, product) => {
            return acc + product.productId.Price * product.quantity;
        }, 0)


        // stock checking loop
        for (let productData of cartData.products) {

            const productid = productData.productId;
            const product = await Product.findOne({ _id: productid })

            // stock checking
            if (product.stock >= productData.quantity) {

                res.render('user/checkout', { addresses: addressData, cartData, cartTotal ,cartItemCount })


            } else {
                res.redirect('/cart')
                // alert('stock is less')
                console.log("stock is less");
            }

        }


    } catch (error) {
        console.log(error.message);
    }
}







module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    logout,
    loadIsBlocked,
    resend,
    // forgot password
    forgetLoad,
    emailverify,
    verifyOTPForgot,
    forgotOTPLoad,
    settingForgotPass,
    ForgotpassOTPresend,

    openingHome,
    loadHome,
    loadOTP,
    verifyOTP,
    loadShop,
    productDetailed,
    // profile
    loadProfile,
    changepassword,
    addAddressLoad,
    addressDelete,
    // edit address
    loadEditAddress,
    editSaveAddress,

    loadCheckout




}
