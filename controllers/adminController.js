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
            wallet: paymentMethods.find(({ _id }) => _id === "wallet")?.orderCount ?? 0,
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




module.exports = {
    loadlogin,
    verifyLogin,
    loadDashboard,
    logout,
    LoadUserDetails,
    userBlock,
    userUnblock,

    //---------- user orders---------
    loadUserorders,
    loadOrders,
    changeStatus,

    //-------- sale report---------
    LoadSalesPage,
    salesReportCollect,
    sendDashboardData, // graph dashboard




}