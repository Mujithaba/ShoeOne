const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const Offer = require('../models/offerModel')



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

        const categoryData = await Category.findById({ _id: categoryID })
        console.log(categoryData, "yyyy");
        const categoryProductsData = await Product.find({ category: categoryID })


        if (categoryData) {

            categoryData.offers = []
            categoryData.offers.push(offerData);


        } else {
            console.log("category is not found");
        }

        await categoryData.save()


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


// deleting offer from category
const offerRemovedFromCategory = async(req, res)=>{
    try {

        const categoryID = req.body.categoryId

        


        const categoryData = await Category.findOneAndUpdate(
            { _id: categoryID },
            { $set: { offers: [] } },
            { new: true } 
        );

        const categoryProductsData = await Product.updateMany(
            { category: categoryID },
            { $set: { offerInfo: [], offerPrice: 0 } },
            { new: true }
        );



        res.json({ message: "Removed Offer from " + categoryData.categoryName })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error ' })
    }
}







module.exports = {

     // offer
     offerLoad,
     addOfferLoad,
     upolodOffer,
     offerList,
     offerUnlist,

     settingOfferToProduct,
     offerRemovedFromProduct,
     
     settingOfferToCategory,
     offerRemovedFromCategory
 

}