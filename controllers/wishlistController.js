const Wishlist = require('../models/wishlistModel')
const Cart = require('../models/cartModel')


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


// wishlist
const loadWishlist = async (req, res) => {
    try {
        const user_id = req.session.user_id;
        // Get the cart count
        console.log(user_id);
        const cartItemCount = await getCartItemCount(user_id);

        // Get wishlist data with population
        const wishlistData = await Wishlist.findOne({ userId: user_id }).populate({
            path: 'products.productId',
            select: 'Price image productName offerPrice'
        });


        res.render('user/wishlist', { cartItemCount, wishlistData });
        
    } catch (error) {
        console.log(error.message);
    }
};



 
// wishlist create
const createWishlist = async(req, res)=>{
    try {

        const user_id = req.session.user_id
        const { prodID } = req.body

        

        const wishlistExist = await Wishlist.findOne({ userId: user_id })

        if (!wishlistExist) {
            const wishlist = new Wishlist({

                userId: user_id,
                products: [{
                    productId: prodID,
                   
                }]

            });
            await wishlist.save()
            res.json({ message: 'Product is added to Wishlist' });
        } else {

            // If the cart exists, check if the product is already in the cart
            const isProductInwishlist = wishlistExist.products.find(product => product.productId.toString() === prodID);

            if (isProductInwishlist) {
                res.json({ msg: 'Product already exists in the wishlist' });
            } else {
                // Product is not in the cart, add it
                wishlistExist.products.push({
                    productId: prodID,
                    
                });
                await wishlistExist.save();
                res.json({ message: 'Product added to wishlist' });
            }
     
        }
        
    } catch (error) {
        console.log(message.error);
    }
}



const deleteProductFromWishlist = async(req, res)=>{
    try {

        const productId = req.params.productId;

        const result = await Wishlist.findOneAndUpdate(
            { 'products.productId': productId },
            { $pull: { products: { productId } } },
            { new: true }
        );

        res.json({ msg: 'Product removed successfully'});
        
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
}


module.exports = {

    loadWishlist,
    createWishlist,
    deleteProductFromWishlist

}