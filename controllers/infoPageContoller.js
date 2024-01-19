const Cart = require('../models/cartModel')

// count cart products 
const getCartItemCount = async (userId) => {
    try {
        const cartExist = await Cart.findOne({ userId });
        console.log("hi there", cartExist);
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



const about = async(req ,res)=>{
    try {
        const user_id = req.session.user_id
        // Get the cart count
        const cartItemCount = await getCartItemCount(user_id);

        res.render('user/about',{cartItemCount})
        
    } catch (error) {
        console.log(error.message);
    }
}


const contact = async(req ,res)=>{
    try {

        const user_id = req.session.user_id
        // Get the cart count
        const cartItemCount = await getCartItemCount(user_id);

        res.render('user/contact',{cartItemCount})
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    about,
    contact
}