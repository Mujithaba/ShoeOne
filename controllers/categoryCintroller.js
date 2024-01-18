const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel')
const Offer = require('../models/offerModel')


// category 
const loadCategory = async (req, res) => {
    try {
        const categoryData = await Category.find();
        const offerData = await Offer.find()
        const productData = await Product.find()
        if (categoryData) {
            res.render('admin/category', { category: categoryData, offerData, productData });
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
        const catID = req.params.catID;
        const category = await Category.findOne({ _id: catID });
        const products = await Product.find({ category: catID });
        console.log(products, "pppoo");

        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }

        category.is_listed = true;
        await category.save();
        console.log('category listed successfully.');

        if (products.length > 0) {
            const updatePromises = [];

            for (const singleProduct of products) {
                singleProduct.is_listed = true;
                updatePromises.push(singleProduct.save());
            }

            await Promise.all(updatePromises);
        } else {
            console.log("No products found");
        }

        res.json({ message: 'category listed successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// unlisted
const categoryUnlist = async (req, res) => {
    try {

        const catID = req.params.catID
        const category = await Category.findOne({ _id: catID })
        const products = await Product.find({ category: catID });

        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }
        category.is_listed = false;
        await category.save()
        console.log('category unlisted successfully.');


        if (products.length > 0) {
            const updatePromises = [];

            for (const singleProduct of products) {
                singleProduct.is_listed = false;
                updatePromises.push(singleProduct.save());
            }

            await Promise.all(updatePromises);
        } else {
            console.log("No products found");
        }


        res.json({ message: 'category unlisted successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}




module.exports = {

    loadCategory,
    addCategory,
    editCategory,
    updateCategory,
    categoryList,
    categoryUnlist,

}