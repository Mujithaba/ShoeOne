const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const admin_route = require('../routes/adminRoute');
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const upload = require('../multer')
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const Coupon = require('../models/couponModel')
const Offer = require('../models/offerModel')
// const { parseISO, isValid, isAfter, isBefore, isToday } = require('date-fns');
// const PDFDocument = require('pdfkit');
// const doc = new PDFDocument;
const fs = require('fs');

const path = require('path');
const { log, count } = require('console');

// admin login

const loadlogin = async (req, res) => {
    try {

        res.render('admin/login-admin')

    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;
        // console.log(email);
        const userData = await User.findOne({ email: email });
        // console.log(userData);
        if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.password);
            // console.log(passwordMatch);
            if (passwordMatch) {

                if (userData.is_admin === 0) {
                    res.render('admin/login-admin', { message: "Email  is incorrect, Admin can only login" });


                }
                else {
                    req.session.admin_id = userData._id;
                    res.redirect("/admin/dashboard");
                }

            }
            else {
                res.render('admin/login-admin', { message: " Password is incorrect" });

            }
        }
        else {
            res.render('admin/login-admin', { message: "Email  is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// loadDashboard method

const loadDashboard = async (req, res) => {
    try {

        res.render('admin/dashboard')

    } catch (error) {
        console.log(error.message);
    }

}


// logout
const logout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}




// UsersDetail
const LoadUserDetails = async (req, res) => {
    try {

        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let page = 1;
        if (req.query.page) {
            page = req.query.page || ""
        }

        const limit = 3

        const userData = await User.find({
            is_admin: 0,
            $or: [
                { firstName: { $regex: '.*' + search + '.*', $options: 'i' } },
                { secondName: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },


            ]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()



        const userCount = await User.find({
            is_admin: 0,
            $or: [
                { firstName: { $regex: '.*' + search + '.*', $options: 'i' } },
                { secondName: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },


            ]
        }).countDocuments()



        res.render('admin/customersList', {
            users: userData,
            totalPage: Math.ceil(userCount / limit),
            currentPage: page
        })

    } catch (error) {

        console.log(error.message);
    }
}

// blocking 
const userBlock = async (req, res) => {
    try {

        const userID = req.params.userID
        console.log(userID);
        const user = await User.findOne({ _id: userID })
        // console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.is_blocked = true;
        await user.save()
        // console.log(user);
        console.log('User blocked successfully.');
        res.json({ message: 'User blocked successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

// unblocking
const userUnblock = async (req, res) => {
    try {

        const userID = req.params.userID
        // console.log(userID);

        const user = await User.findOne({ _id: userID })
        // console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.is_blocked = false;
        await user.save()
        console.log('User unblocked successfully.');
        res.json({ message: 'User Unblocked successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


// category 
const loadCategory = async (req, res) => {
    try {
        const categoryData = await Category.find();
        const offerData = await Offer.find()
        const productData =  await Product.find()
        if (categoryData) {
            res.render('admin/category', { category: categoryData, offerData ,productData});
        } else {
            alert('category not found')
        }


    } catch (error) {
        console.log(error.message);

    }
}


// add-Category
const addCategory = async (req, res) => {
    try {

        const catName = req.body.categoryName;
        // console.log("gjhsqj",catName);
        const category = new Category({ categoryName: catName })
        const categoryData = await category.save()

        if (!categoryData) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'Added successfully', category: categoryData })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// edit category
const editCategory = async (req, res) => {

    try {
        const id = req.query.id
        const categoryData = await Category.findById({ _id: id })
        if (categoryData) {
            res.render('admin/edit-adcategory', { category: categoryData })
        } else {
            res.redirect('/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }

}

const updateCategory = async (req, res) => {
    try {
        const categoryID = req.body.categoryID;

        const categoryData = await Category.findByIdAndUpdate({ _id: categoryID }, { $set: { categoryName: req.body.editCategoryName, is_listed: true } })
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message);
    }
}


// category list and unlist

const categoryList = async (req, res) => {
    try {

        const catID = req.params.catID
        const category = await Category.findOne({ _id: catID })
        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }
        category.is_listed = true;
        await category.save()
        console.log('category listed successfully.');
        res.json({ message: 'category listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

// unlisted
const categoryUnlist = async (req, res) => {
    try {

        const catID = req.params.catID
        const category = await Category.findOne({ _id: catID })
        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }
        category.is_listed = false;
        await category.save()
        console.log('category unlisted successfully.');
        res.json({ message: 'category unlisted successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

// product page admin
const productLoad = async (req, res) => {

    try {

        const offerData = await Offer.find()


        let page = 1;
        if (req.query.page) {
            page = req.query.page
        }

        const limit = 3


        const fullProduct = await Product.find().populate('category')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        //   console.log(fullProduct);

        const productCount = await Product.find()
            .countDocuments()


        res.render('admin/product', { fullProduct, offerData, totalPage: Math.ceil(productCount / limit) })


    } catch (error) {
        console.log(error.message);
    }
}


// Product Add page 
const addProductLoad = async (req, res) => {
    try {
        const fullCategory = await Category.find({ is_listed: true })
        res.render('admin/add-product', { fullCategory })
    } catch (error) {
        console.log(error.message);
    }
}




// upload add-product
const uploadDetails = async (req, res) => {
    try {
        const uploadedFiles = req.files;
        // console.log(uploadedFiles);
        const filePaths = await uploadedFiles.map(file => file.filename);
        const products = new Product({
            productName: req.body.productName,
            Price: req.body.Price,
            productSize: req.body.productSize,
            image: filePaths,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category,
            is_listed: true
        })

        const productData = await products.save()

        res.redirect('/admin/product')

    } catch (error) {
        console.log(error.message);
    }
}



// Edit product
const editProduct = async (req, res) => {

    try {

        const id = req.query.id.trim();
        const productData = await Product.findById({ _id: id })
        const fullCategory = await Category.find({ is_listed: true })
        if (productData) {
            res.render('admin/edit-product', { product: productData, fullCategory })
        } else {
            res.redirect('/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }

}

const updateProduct = async (req, res) => {
    try {
        const uploadedFiles = req.files;
        console.log(uploadedFiles);
        const filePaths = await uploadedFiles.map(file => file.filename);
        // console.log(req.body);
        const productID = req.body.productID;
        // console.log(productID);
        if (uploadedFiles.length !== 0) {
            const productDataWithImg = await Product.findByIdAndUpdate(
                { _id: productID },
                {
                    $set: {
                        image: filePaths,
                        productName: req.body.productName,
                        Price: req.body.Price,
                        productSize: req.body.productSize,
                        stock: req.body.stock,
                        category: req.body.category,
                        description: req.body.description,
                        is_listed: true
                    }
                }
            );
        } else {
            const productData = await Product.findByIdAndUpdate(
                { _id: productID },
                {
                    $set: {

                        productName: req.body.productName,
                        Price: req.body.Price,
                        productSize: req.body.productSize,
                        stock: req.body.stock,
                        category: req.body.category,
                        description: req.body.description,
                        is_listed: true
                    }
                }
            );
        }



        res.redirect('/admin/product');
    } catch (error) {
        console.log(error.message);
    }
};



// Product List
const productList = async (req, res) => {
    try {

        const prodID = req.params.prodID
        const product = await Product.findOne({ _id: prodID })
        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }
        product.is_listed = true;
        await product.save()

        console.log('product listed successfully.');
        res.json({ message: 'product listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}
// unlist Product
const productUnlist = async (req, res) => {
    try {
        const prodID = req.params.prodID

        const product = await Product.findOne({ _id: prodID })
        if (!product) {
            return res.status(404).json({ error: 'User not found' });
        }
        product.is_listed = false;
        await product.save()
        console.log('product unlisted successfully.');
        res.json({ message: 'product unlisted successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


// user order details
const loadUserorders = async (req, res) => {
    try {


        let page = 1;
        if (req.query.page) {
            page = req.query.page
        }

        const limit = 4


        const orderData = await Order.find().populate({
            path: 'products.productId',
            select: 'Price image productName quantity'
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ orderDate: -1 })
            .exec()

        const orderCount = await Order.findOne().countDocuments();



        res.render('admin/userOrders', { orderData, totalPage: Math.ceil(orderCount / limit) })

    } catch (error) {
        console.log(error.message);
    }
}


// order view each ussers
const loadOrders = async (req, res) => {
    try {
        const order_id = req.query.id
        // console.log(order_id);


        const orderData = await Order.findOne({ _id: order_id }).populate({
            path: 'products.productId',
            select: 'Price image productName'
        })



        res.render('admin/order-info', { orderData })

    } catch (error) {
        console.log(error.message);
    }
}


const changeStatus = async (req, res) => {
    try {
        console.log("heloo");
        const orderId = req.body.orderID
        const statusPro = req.body.productStatus
        const productID = req.body.productID

        const statusSet = await Order.findOneAndUpdate({ _id: orderId, 'products.productId': productID },
            { $set: { 'products.$.ProductOrderStatus': statusPro } },
            { new: true })

        // console.log(statusSet);
        res.json({ message: 'Product status changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }

}



// sales report
const LoadSalesPage = async (req, res) => {
    try {

        res.render('admin/salesPage')

    } catch (error) {
        console.log(message.error);
    }
}



// collect report based on the date

const salesReportCollect = async (req, res) => {
    try {

        console.log("ethyooooo");

        let { startDate, endDate } = req.body;


        // Validate date format (you can use a library like moment.js for more sophisticated date parsing)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            return res.status(400).json({ message: 'Invalid date format. Use DD/MM/YYYY.' });
        }

        startDate = startDate.split('/');
        endDate = endDate.split('/');

        // Parse the dates
        const fromDate = new Date(`${startDate[2]}/${startDate[1]}/${startDate[0]}`);
        const toDate = new Date(`${endDate[2]}/${endDate[1]}/${endDate[0]}`);

        // Validate date range
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate > toDate) {
            return res.status(400).json({ error: 'Invalid date range. End date should be equal to or later than the start date.' });
        }


        // startDate = startDate.split('/')
        // endDate = endDate.split('/')


        // const fromDate = new Date(`${startDate[2]}/${startDate[1]}/${startDate[0]}`);
        // const toDate = new Date(`${endDate[2]}/${endDate[1]}/${endDate[0]}`);

        console.log('startDate:', fromDate);
        console.log('endDate:', toDate);


        const salesOrders = await Order.aggregate([
            {
                $match: {
                    $and: [
                        { orderDate: { $gte: fromDate } },
                        { orderDate: { $lte: toDate } }
                    ]
                }
            }
        ]);


        if (salesOrders.length > 0) {
            console.log(salesOrders);
            res.json({ message: 'Sales report processed successfully', salesOrders });
        } else {
            console.log("No sales happened within these dates");
            res.json({ error: 'No sales happened within these dates', salesOrders: [] });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });

    }
}





// graph dashboard
const sendDashboardData = async (req, res) => {
    try {

        const customerArray = await User.aggregate([{ $count: "customers" }]);

        console.log(customerArray);
        let customers = 0;

        if (customerArray.length) {
            [{ customers }] = customerArray
        }

        const { time } = req.query;
        let timeFrame = new Date(new Date().setHours(0, 0, 0, 0));
        let pipeline = [
            {
                $match: {

                    orderDate: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1,
                    orderCount: 1,
                    label: "Today",
                },
            },
        ];




        if (time === "week") {
            timeFrame = new Date(new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000);

            pipeline = [
                {
                    $match: {
                        orderDate: {
                            $gte: new Date(new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000),
                            $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$orderDate" },
                        totalAmount: { $sum: "$totalAmount" },
                        orderCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        label: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                                    { case: { $eq: ["$_id", 2] }, then: "Monday" },
                                    { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                                    { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                                    { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                                    { case: { $eq: ["$_id", 6] }, then: "Friday" },
                                    { case: { $eq: ["$_id", 7] }, then: "Saturday" },
                                ],
                                default: "Unknown",
                            },
                        },
                        totalAmount: 1,
                        orderCount: 1,
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ];
        }





        if (time === "month") {
            timeFrame = new Date(new Date().getFullYear(), 0, 1);

            pipeline = [
                {
                    $match: {
                        orderDate: {
                            $gte: new Date(new Date().setDate(1)),
                            $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                        },
                    },
                },
                {
                    $group: {
                        _id: { $month: "$orderDate" },
                        totalAmount: { $sum: "$totalAmount" },
                        orderCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        label: { $dateToString: { format: "%B", date: { $dateFromParts: { year: new Date().getFullYear(), month: "$_id" } } } }, // Format month name
                        totalAmount: 1,
                        orderCount: 1,
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ];
        }







        if (time === "year") {
            const currentYear = new Date().getFullYear();
            const firstYear = currentYear - 4;

            timeFrame = new Date(firstYear, 0, 1);

            pipeline = [
                {
                    $match: {
                        orderDate: {
                            $gte: new Date(firstYear, 0, 1),
                            $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                        },
                    },
                },
                {
                    $group: {
                        _id: { $year: "$orderDate" },
                        totalAmount: { $sum: "$totalAmount" },
                        orderCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        label: "$_id",
                        totalAmount: 1,
                        orderCount: 1,
                    },
                },
                {
                    $sort: { label: 1 },
                },
            ];
        }






        // payment method
        const paymentMethods = await Order.aggregate([
            { $match: { orderDate: { $gte: timeFrame } } },
            { $group: { _id: "$paymentMethod", orderCount: { $sum: 1 } } },
        ]);

        const payment = {


            online: paymentMethods.find(({ _id }) => _id === "online")?.orderCount ?? 0,
            cod: paymentMethods.find(({ _id }) => _id === "COD")?.orderCount ?? 0,
        };




        // sales
        const salesDetails = await Order.aggregate(pipeline);

        const sales = {
            totalAmount: 0,
            orderCount: [],
            label: [],
        };
        // console.log(salesDetails);
        sales.totalAmount = salesDetails.reduce((acc, { totalAmount }) => {
            return acc + Number(totalAmount);
        }, 0);
        sales.orderCount = salesDetails.map(({ orderCount }) => orderCount);
        sales.label = salesDetails.map(({ label }) => label);

        res.status(200).json({
            status: "success",
            customers,
            payment,
            salesDetails,
            sales,

        });

    } catch (error) {
        // console.log(message.error);
        res.status(500).json({ message: 'Internal server error' });
    }
}





// load coupon
const loadCoupon = async (req, res) => {
    try {

        const couponData = await Coupon.find()
        // console.log(couponData);
        res.render('admin/coupon', { couponData })

    } catch (error) {
        console.log(error);
    }
}



// add coupon
const addCouponLoad = async (req, res) => {
    try {


        res.render('admin/addCoupon')

    } catch (error) {
        console.log(error);
    }
}

const uploadCoupon = async (req, res) => {
    try {

        const coupon = new Coupon({
            code: req.body.couponCode,
            validFrom: req.body.validFromDate,
            expiry: req.body.expiryDate,
            discountAmount: req.body.discountAmount,
            minimumCartValue: req.body.minCartValue,
            is_listed: true
        })

        const couponData = await coupon.save()
        res.redirect('/admin/couponAdmin')

    } catch (error) {
        console.log(error);
    }
}


// Coupon List
const couponList = async (req, res) => {
    try {

        const couponID = req.params.couponID

        const coupon = await Coupon.findOne({ _id: couponID })
        if (!coupon) {
            return res.status(404).json({ error: 'coupon is not found' });
        }
        coupon.is_listed = true;
        await coupon.save()

        console.log('coupon listed successfully.');
        res.json({ message: 'coupon listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


// coupon Unlist
const couponUnlist = async (req, res) => {
    try {

        const couponID = req.params.couponID
        const coupon = await Coupon.findOne({ _id: couponID })
        if (!coupon) {
            return res.status(404).json({ error: 'coupon is not found' });
        }
        coupon.is_listed = false;
        await coupon.save()

        console.log('coupon listed successfully.');
        res.json({ message: 'coupon listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

// edit Coupon
const editCoupon = async (req, res) => {
    try {

        const couponId = req.query.id.trim();

        const couponData = await Coupon.findById({ _id: couponId })

        res.render('admin/editCoupon', { couponData })
    } catch (error) {
        console.log(error);
    }
}


// updated Coupon
const updatedCoupon = async (req, res) => {
    try {

        const couponId = req.body.couponId;

        const updateCoupon = await Coupon.findByIdAndUpdate({ _id: couponId },

            {
                $set: {
                    code: req.body.couponCode,
                    validFrom: req.body.validFromDate,
                    expiry: req.body.expiryDate,
                    discountAmount: req.body.discountAmount,
                    minimumCartValue: req.body.minCartValue,
                    is_listed: true
                }
            })

        res.redirect('/admin/couponAdmin');

    } catch (error) {
        console.log(error);
    }
}

const offerLoad = async (req, res) => {
    try {


        const offerData = await Offer.find()

        res.render('admin/Offers', { offerData })

    } catch (error) {
        console.log(error);
    }
}


// add offer
const addOfferLoad = async (req, res) => {
    try {


        res.render('admin/add-Offer')

    } catch (error) {
        console.log(error);
    }
}

// upoload offer
const upolodOffer = async (req, res) => {
    try {

        const offer = new Offer({
            offerName: req.body.offername,
            validFrom: req.body.validFromDate,
            expiry: req.body.expiryDate,
            discountOffer: req.body.discountoffer,
            is_listed: true
        })

        const offerData = await offer.save()
        res.redirect('/admin/offerPage')

    } catch (error) {
        console.log(error);
    }
}


// Offer List
const offerList = async (req, res) => {
    try {

        const offerID = req.params.offerID
        console.log(offerID, "mmm");

        const offer = await Offer.findOne({ _id: offerID })
        if (!offer) {
            return res.status(404).json({ error: 'offer is not found' });
        }
        offer.is_listed = true;
        await offer.save()

        console.log('offer listed successfully.');
        res.json({ message: 'offer listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


// Offer Unlist
const offerUnlist = async (req, res) => {
    try {

        const offerID = req.params.offerID
        const offer = await Offer.findOne({ _id: offerID })
        if (!offer) {
            return res.status(404).json({ error: 'offer is not found' });
        }
        offer.is_listed = false;
        await offer.save()

        console.log('offer listed successfully.');
        res.json({ message: 'offer listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


// added offer Set to product
const settingOfferToProduct = async (req, res) => {
    try {

        const { offerId, productID } = req.body


        const productData = await Product.findOne({ _id: productID })
        const offerData = await Offer.findOne({ _id: offerId })

        productData.offerInfo = []
        productData.offerInfo.push(offerData);
        const offerPrice = Math.floor(
            productData.Price - (productData.Price * (offerData.discountOffer / 100))
        );

        productData.offerPrice = offerPrice

        await productData.save();

        res.json({ message: "Added" + offerData.offerName + "to product" + productData.productName })

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Removing offer from product
const offerRemovedFromProduct = async (req, res) => {
    try {

        const productId = req.body.prodID


        const productData = await Product.findOneAndUpdate(
            { _id: productId },
            { $set: { offerInfo: [], offerPrice: 0 } },
            { new: true } // This ensures that you get the updated document back
        );


        res.json({ message: "Removed Offer from " + productData.productName })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Adding offer To  Category

const settingOfferToCategory = async (req, res) => {
    try {

        const { offerId, categoryID } = req.body
        console.log(offerId, categoryID, "oooooiii");

        const offerData = await Offer.findOne({ _id: offerId })

        const categoryProductsData = await Product.find({ category: categoryID })
        console.log(categoryProductsData, "got it");



        const updatePromises = [];

        for (const product of categoryProductsData) {
            product.offerInfo = [];
            product.offerInfo.push(offerData);
            const offerPrice = Math.floor(
                product.Price - (product.Price * (offerData.discountOffer / 100))
            );

            product.offerPrice = offerPrice;

            updatePromises.push(product.save());
        }

        await Promise.all(updatePromises);

        res.json({
            message: `Added ${offerData.offerName} to products in category`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error ' })
    }
}

module.exports = {
    loadlogin,
    verifyLogin,
    loadDashboard,
    logout,
    LoadUserDetails,
    userBlock,
    userUnblock,
    loadCategory,
    addCategory,
    editCategory,
    updateCategory,
    categoryList,
    categoryUnlist,
    productLoad,
    addProductLoad,
    uploadDetails,
    editProduct,
    updateProduct,
    productList,
    productUnlist,

    // user orders
    loadUserorders,
    loadOrders,
    changeStatus,

    // sale report
    LoadSalesPage,
    salesReportCollect,
    // graph dashboard
    sendDashboardData,

    // coupon
    loadCoupon,
    addCouponLoad,
    uploadCoupon,
    couponList,
    couponUnlist,
    editCoupon,
    updatedCoupon,

    // offer
    offerLoad,
    addOfferLoad,
    upolodOffer,
    offerList,
    offerUnlist,
    settingOfferToProduct,
    offerRemovedFromProduct,
    settingOfferToCategory


}