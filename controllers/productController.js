const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const upload = require('../multer')
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const Coupon = require('../models/couponModel')
const Offer = require('../models/offerModel')



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





module.exports = {

    productLoad,
    addProductLoad,
    uploadDetails,
    editProduct,
    updateProduct,
    productList,
    productUnlist,

}