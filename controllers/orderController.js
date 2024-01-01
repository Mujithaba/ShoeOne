const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')


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

          // Get the cart count
          const cartItemCount = await getCartItemCount(user_id);

        res.render('user/myOrder', { orderData ,cartItemCount })

    } catch (error) {
        console.log(error.message);
    }
}



// view order method
const loadViewOrder = async (req, res) => {
    try {
        const user_id = req.session.user_id

        const order_id = req.query.id
        const orderData = await Order.findOne({ _id: order_id }).populate({
            path: 'products.productId',
            select: 'Price image productName'
        })

          // Get the cart count
          const cartItemCount = await getCartItemCount(user_id);

        res.render('user/viewOrders', { orderData ,cartItemCount})

    } catch (error) {
        console.log(error.message);
    }
}


// cancel order status fetch
const cancelOrder = async (req, res) => {
    try {

        const productID = req.body.productId
        const orderID = req.body.orderId
        console.log(orderID);

        const orderDetails = await Order.findOneAndUpdate(
            {_id: orderID, 'products.productId': productID },
            { $set: { 'products.$.ProductOrderStatus': 'Cancelled' } },
            { new: true } // Return the modified document
        )

        // stock increase bcz the product is cancelled
        if (orderDetails) {
            const productToCancel = orderDetails.products.find((product) => product.productId == productID);
            // console.log("kkk" + productToCancel.quantity);
            
            if (productToCancel) {

                const productData = await Product.findOneAndUpdate({ _id: productID },
                    {$inc:{'stock': productToCancel.quantity}},
                    {new:true})
                // console.log(productData);
            }else{
                console.log("productToCancel not found");
            }

        }else{
            console.log("orderDetails is not found");
        }

        res.json({ message: 'Product cancelled successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}




// return order status fetch
const returnOrder = async(req,res)=>{
    try {

        const prodID = req.body.productId
        const order_id =req.body.orderId
        console.log("return"+order_id);

        // order return setting
        const orderReturn = await Order.findOneAndUpdate(
            { _id: order_id ,'products.productId': prodID },
            { $set: { 'products.$.ProductOrderStatus': 'Returned' } },
            { new: true } // Return the modified document
        )

        // the order returned the stock will increase 
        if (orderReturn) {
            console.log("Order products:");
            const productToReturn = orderReturn.products.find((product) => product.productId == prodID);
            
            if (productToReturn) {
                const productData = await Product.findOneAndUpdate({ _id: prodID },
                    {$inc:{'stock': productToReturn.quantity}},
                    {new:true})
            }else{
                console.log("productToReturn is  not found");
            }

        }else{
            console.log("orderReturn is not found");
        }

        
        res.json({ message: 'Product returned successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}


module.exports = {

    orderPlace,
    loadSuccessPlace,
    loadMyOrder,
    loadViewOrder,
    cancelOrder,
    returnOrder

}