const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const admin_route = require('../routes/adminRoute');
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const upload = require('../multer')
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
// const PDFDocument = require('pdfkit');
// const doc = new PDFDocument;
const fs = require('fs');

const path = require('path');
const { log } = require('console');

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

        const userData = await User.find({
            is_admin: 0,
            $or: [
                { firstName: { $regex: '.*' + search + '.*', $options: 'i' } },
                { secondName: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                // { mobile:{ $regex: '.*'+search+'.*',$options:'i' }}

            ]
        })

        res.render('admin/customersList', { users: userData })

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
        if (categoryData) {
            res.render('admin/category', { category: categoryData });
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

        const fullProduct = await Product.find().populate('category')
        //   console.log(fullProduct);

        res.render('admin/product', { fullProduct })

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
        // console.log("gfgfg",prodID);
        const product = await Product.findOne({ _id: prodID })
        // console.log(product);
        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }
        product.is_listed = true;
        await product.save()
        // console.log(product);
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

        const orderData = await Order.find().populate({
            path: 'products.productId',
            select: 'Price image productName quantity'
        })

        res.render('admin/userOrders', { orderData })

    } catch (error) {
        console.log(error.message);
    }
}


// order view each ussers
const loadOrders = async (req, res) => {
    try {
        console.log("helloooo");
        const order_id = req.query.id
        // console.log(order_id);
        const orderData = await Order.findOne({ _id: order_id }).populate({
            path: 'products.productId',
            select: 'Price image productName'
        })
        // console.log(orderData);
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

        // console.log(statusPro);
        // console.log(orderId);
        // console.log(productID);

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

        startDate = startDate.split('/')
        endDate = endDate.split('/')
        console.log(startDate);
        console.log(endDate);

        const fromDate = new Date(`${startDate[2]}/${startDate[1]}/${startDate[0]}`);
        const toDate = new Date(`${endDate[2]}/${endDate[1]}/${endDate[0]}`);

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

       

        if (salesOrders) {
            console.log(salesOrders);

            


        } else {
            console.log("no sales happened these dates");
        }



            

            
        

        res.json({ message: 'Sales report processed successfully', salesOrders });


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


        // if (time === "week") {
        //     timeFrame = new Date(new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000);
        //     pipeline = [
        //         {
        //             $match: {
        //                 orderDate: {
        //                     $gte: new Date(new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000),
        //                     $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        //                 },
        //             },
        //         },
        //         {
        //             $group: {
        //                 _id: { $dayOfWeek: "$orderDate" }, // Group by day of the week
        //                 totalAmount: { $sum: "$totalAmount" },
        //                 orderCount: { $sum: 1 }, // Count the number of orders
        //             },
        //         },
        //         {
        //             $project: {
        //                 _id: 0, // Exclude _id field
        //                 label: "$_id", // Rename _id to dayOfWeek
        //                 totalAmount: 1,
        //                 orderCount: 1,
        //             },
        //         },
        //         {
        //             $sort: { label: 1 },
        //         },
        //     ];
        // }





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

        console.log(payment);
        // console.log(products);
        console.log(sales);

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
    sendDashboardData




}