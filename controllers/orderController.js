const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const Razorpay = require('razorpay')

const { Razorpay_key_id, Razorpay_key_secrete } = process.env

var instance = new Razorpay({
    key_id: Razorpay_key_id,
    key_secret: Razorpay_key_secrete,
});



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
        const totalOrderAmount = req.body.totalProdAmount
        const addedCouponDiscount = req.body.couponDiscount
        console.log(totalOrderAmount, "coupon included");
        console.log(addedCouponDiscount, "discount");



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




        // is coupon discount coming time this condition work otherwise else will work
        if (totalOrderAmount > 0) {

            // Cash on delivery placeorder checking
            if (paymentType === 'COD') {

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
                    totalAmount: totalOrderAmount,
                    paymentMethod: paymentType,
                    couponAmountDis: addedCouponDiscount

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



            } else {
                const userData = await User.findOne({ _id: user_id })
                console.log(userData);

                var options = {
                    amount: totalOrderAmount * 100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: user_id
                };
                instance.orders.create(options, function (err, order) {
                    console.log(order);
                    res.json({ success: true, userData, Razorpay_key_id, cartTotal, order, totalOrderAmount, addedCouponDiscount })
                });

            }

        } else {   // coupon discount is not included


            // Cash on delivery placeorder checking
            if (paymentType === 'COD') {

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



            } else {
                const userData = await User.findOne({ _id: user_id })
                console.log(userData);

                var options = {
                    amount: cartTotal * 100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: user_id
                };
                instance.orders.create(options, function (err, order) {
                    console.log(order);
                    res.json({ success: true, userData, Razorpay_key_id, cartTotal, order })
                });

            }

        }




    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const verifyPayment = async (req, res) => {
    try {
        console.log("ethikn");
        const user_id = req.session.user_id
        const paymentType = req.body.paymentType
        const addressId = req.body.addressId;
        const payment = req.body.payment

        const totalOrderAmount = req.body.totalOrderAmount
        const couponDiscount = req.body.couponDiscount
        console.log(totalOrderAmount, "bye bye");
        console.log(couponDiscount, "ta taa");

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


        // crypto 
        const crypto = require("crypto");
        const hmac = crypto.createHmac('sha256', Razorpay_key_secrete);
        hmac.update(payment.razorpay_order_id + "|" + payment.razorpay_payment_id);
        let generatedSignature = hmac.digest('hex');


        // checking the signature
        if (generatedSignature === payment.razorpay_signature) {
            console.log("payment successfull");

            // if coupon is included this will work
            if (totalOrderAmount > 0) {
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
                    totalAmount: totalOrderAmount,
                    paymentMethod: paymentType,
                    couponAmountDis: couponDiscount

                })

                const order = await orderDetails.save()
                if (order) {
                    const deleteCart = await Cart.findOneAndDelete({ userId: user_id })
                    await StockAdjusting(cartData.products)
                } else {
                    console.log("Not deleted the product");
                }

                res.json({ status: true })


            } else {
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
                if (order) {
                    const deleteCart = await Cart.findOneAndDelete({ userId: user_id })
                    await StockAdjusting(cartData.products)
                } else {
                    console.log("Not deleted the product");
                }

                res.json({ status: true })
            }


        } else {
            console.log("its not matching");
            res.json({ msg: "Something went wrong in your order " })
        }



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

        let page = 1;
        if (req.query.page) {
            page = req.query.page
        }

        const limit = 2



        const orderData = await Order.find({ userId: user_id }).populate({
            path: 'products.productId',
            select: 'Price image productName quantity'
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ orderDate: -1 })
            .exec()

           

        const orderCount = await Order.find({ userId: user_id }).countDocuments()

       

        // Get the cart count
        const cartItemCount = await getCartItemCount(user_id);

        res.render('user/myOrder', { orderData, cartItemCount, totalPage: Math.ceil(orderCount / limit), currentPage: page })

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

        res.render('user/viewOrders', { orderData, cartItemCount })

    } catch (error) {
        console.log(error.message);
    }
}


// cancel order status fetch
const cancelOrder = async (req, res) => {
    try {

        const productID = req.body.productId
        const orderID = req.body.orderId
        const user_id = req.session.user_id
        console.log(user_id,"wallet");


       


        const orderData = await Order.findOne({_id: orderID}).populate({
            path: 'products.productId',
            select: 'Price image productName quantity'
        })

console.log(orderData.products.productId.unitPrice,"baahubali");

// wallet

        const orderDetails = null;

        if (orderData.couponAmountDis) {



             orderDetails = await Order.findOneAndUpdate(
                { _id: orderID, 'products.productId': productID },
                { $set: { 'products.$.ProductOrderStatus': 'Cancelled' } },
                { new: true } // Return the modified document
            )
            
            console.log(orderData.couponAmountDis,"masha");
    
            }else {

                 orderDetails = await Order.findOneAndUpdate(
                    { _id: orderID, 'products.productId': productID },
                    { $set: { 'products.$.ProductOrderStatus': 'Cancelled' } },
                    { new: true } // Return the modified document
                )
    
            }



        // stock increase bcz the product is cancelled
        if (orderDetails) {
            const productToCancel = orderDetails.products.find((product) => product.productId == productID);



            if (productToCancel) {

                const productData = await Product.findOneAndUpdate({ _id: productID },
                    { $inc: { 'stock': productToCancel.quantity } },
                    { new: true })
                // console.log(productData);
            } else {
                console.log("productToCancel not found");
            }

        } else {
            console.log("orderDetails is not found");
        }

        res.json({ message: 'Product cancelled successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}




// return order status fetch
const returnOrder = async (req, res) => {
    try {

        const prodID = req.body.productId
        const order_id = req.body.orderId
        console.log("return" + order_id);

        // order return setting
        const orderReturn = await Order.findOneAndUpdate(
            { _id: order_id, 'products.productId': prodID },
            { $set: { 'products.$.ProductOrderStatus': 'Returned' } },
            { new: true } // Return the modified document
        )

        // the order returned the stock will increase 
        if (orderReturn) {
            console.log("Order products:");
            const productToReturn = orderReturn.products.find((product) => product.productId == prodID);

            if (productToReturn) {
                const productData = await Product.findOneAndUpdate({ _id: prodID },
                    { $inc: { 'stock': productToReturn.quantity } },
                    { new: true })
            } else {
                console.log("productToReturn is  not found");
            }

        } else {
            console.log("orderReturn is not found");
        }


        res.json({ message: 'Product returned successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}




const walletLoad = async (req, res) => {
    try {

        const user_id = req.session.user_id

        // Get the cart count
        const cartItemCount = await getCartItemCount(user_id);

        res.render('user/wallet', { cartItemCount })

    } catch (error) {
        console.log(message.error);
    }
}

module.exports = {

    orderPlace,
    verifyPayment,
    loadSuccessPlace,
    loadMyOrder,
    loadViewOrder,
    cancelOrder,
    returnOrder,
    walletLoad

}