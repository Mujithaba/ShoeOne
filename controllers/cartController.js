const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
    const Cart = require('../models/cartModel')



// loadCart
const loadCart = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const cartData = await Cart.findOne({ userId: user_id }).populate({
            path: 'products.productId',
            select: 'Price image stock productName' // Add any other fields , separated by space
        });

        if(cartData){// total whole product price in the cart
        const cartTotal = cartData.products.reduce((acc, product) => {
            return acc + product.productId.Price * product.quantity;
        }, 0);
        // console.log(cartTotal);

        res.render('user/cart', { cart: cartData, cartTotal })
    }else{
        res.render('user/cart')
    }
    } catch (error) {
        console.log(error.message);
    }
}



// CreateCart
const CreateCart = async (req, res) => {
    try {

        const user_id = req.session.user_id
        const { prodID } = req.body

        //    const userData = await User.findOne({id:user_id})

        const cartExist = await Cart.findOne({ userId: user_id })

        if (!cartExist) {
            const cart = new Cart({

                userId: user_id,
                products: [{
                    productId: prodID,
                    quantity: 1
                }]

            });
            await cart.save()
            res.json({ message: 'Product is added to cart' });
        } else {

            // If the cart exists, check if the product is already in the cart
            const isProductInCart = cartExist.products.find(product => product.productId.toString() === prodID);

            if (isProductInCart) {
                res.json({ msg: 'Product already exists in the cart' });
            } else {
                // Product is not in the cart, add it
                cartExist.products.push({
                    productId: prodID,
                    quantity: 1
                });
                await cartExist.save();
                res.json({ message: 'Product added to cart' });
            }
            // cartExist.totalPrice =products.Price*quantity
        }

    } catch (error) {
        console.log(error.message);
    }
}



// update cart 

const updateQuantity = async (req, res) => {
    try {
        const prodID = req.body.productId
        const newQuantity = req.body.newQuantity

        // Update the quantity for the specific product in the array
        const result = await Cart.findOneAndUpdate(
            { 'products.productId': prodID },
            { $set: { 'products.$.quantity': newQuantity } },
            { new: true } // Return the modified document
        ).populate({
            path: 'products.productId',
            select: 'Price stock' 
        });

        // Extract the product price from the populated result
        
        const productPrice = result.products.find(product => product.productId._id.toString() === prodID).productId.Price;
        const totalStock = result.products.find(product => product.productId._id.toString() === prodID).productId.stock;

        //calculating the whole product iprice in the cart 
        const cartTotal = result.products.reduce((acc, product) => {
            return acc + product.productId.Price * product.quantity;
        }, 0);


        const quantityData = await result.save();
        res.json({ message: 'Quantity updated successfully', priceTotalQty: productPrice * newQuantity, totalStock, cartTotal });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });

    }
}


// deleting product from cart
const deleteProduct = async (req, res) => {
    try {

        const productId = req.params.productId;
       
        // Implement logic to remove the product from the cart collection
        const result = await Cart.findOneAndUpdate(
            { 'products.productId': productId },
            { $pull: { products: { productId } } },
            { new: true }
        );


        if (result) {
            // Calculate the updated cart total
            const cartTotal = result.products.reduce((acc, product) => {
                return acc + product.productId.Price * product.quantity;
            }, 0);
             
            await result.save()
            // Send the updated cart data in the response
            res.json({ msg: 'Product removed successfully', cartTotal });
        } else {
            res.status(404).json({ message: 'Product not found in the cart' });
        }
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    loadCart,
    CreateCart,
    updateQuantity,
    deleteProduct
}