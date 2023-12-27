const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')






// stockAdjusting
const StockAdjusting = async (cartData) => {
    for (let element of cartData) {
        try {
            let productId = element.productId;

            // Update the stock for the specific product
            let updateProduct = await Product.updateOne(
                { _id: productId },
                { $inc: { stock: -element.quantity } }
            );

            console.log(`Stock adjusted for product ${productId}`);
        } catch (error) {
            console.error(`Error adjusting stock: ${error}`);
        }
    }
};



// place order storing method
const orderPlace = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const addressId = req.body.addressId;
        const paymentType = req.body.paymentType
        console.log(user_id + "userid");
        console.log(addressId + "addresid");
        console.log("type" + paymentType);

        // taking address from databse
        const ShippingAddress = await Address.findOne({ _id: addressId })

        // taking product details from the cart based
        const cartData = await Cart.findOne({ userId: user_id }).populate({
            path: 'products.productId',
            select: 'Price '
        })

        // calculating total price for place order
        const cartTotal = cartData.products.reduce((acc, product) => {
            return acc + product.productId.Price * product.quantity;
        }, 0)


        // order database creating

        const orderDetails = new Order({
            userId: user_id,
            shippingAddress: {
                fullname: ShippingAddress.fullname,
                mobile: ShippingAddress.mobile,
                address: ShippingAddress.address,
                pincode: ShippingAddress.pincode,
                city: ShippingAddress.city,
                state: ShippingAddress.state
            },
            products: cartData.products.map(product => {
                return {
                    productId: product.productId,
                    quantity: product.quantity,
                    unitPrice: product.productId.Price,
                    ProductOrderStatus: 'pending'
                }
            }),
            OrderStatus: 'ordered',
            StatusLevel: 1,
            totalAmount: cartTotal,
            paymentMethod: paymentType

        })

        const order = await orderDetails.save()
        console.log("orders" + order);
        if (order) {
            const deleteCart = await Cart.findOneAndDelete({ userId: user_id })
            await StockAdjusting(cartData.products)
        } else {
            console.log("Not deleted the product");
        }
        res.json({ message: "Order placed successfully" })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// success page for place order
const loadSuccessPlace = async (req, res) => {
    try {
        res.render('user/placeOrder')
    } catch (error) {
        console.log(error.message);
    }
}


// load myOrder
const loadMyOrder = async (req, res) => {
    try {

        const user_id = req.session.user_id
        // console.log(user_id);

        const orderData = await Order.find({ userId: user_id }).populate({
            path: 'products.productId',
            select: 'Price image productName quantity'
        })

        //    console.log(orderData);

        res.render('user/myOrder', { orderData })

    } catch (error) {
        console.log(error.message);
    }
}



// view order method
const loadViewOrder = async (req, res) => {
    try {

        const order_id = req.query.id
        // console.log(order_id);
        const orderData = await Order.findOne({ _id: order_id }).populate({
            path: 'products.productId',
            select: 'Price image productName'
        })

        res.render('user/viewOrders', { orderData })

    } catch (error) {
        console.log(error.message);
    }
}


// cancel order status fetch
const cancelOrder = async (req, res) => {
    try {

        const productID = req.body.productId
        console.log(productID);

        const orderDetails = await Order.findOneAndUpdate(
            { 'products.productId': productID },
            { $set: { 'products.$.ProductOrderStatus': 'Cancelled' } },
            { new: true } // Return the modified document
        )
console.log(orderDetails);
        res.json({ message: 'Product cancelled successfully' });


    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}


module.exports = {

    orderPlace,
    loadSuccessPlace,
    loadMyOrder,
    loadViewOrder,
    cancelOrder

}