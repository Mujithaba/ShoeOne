
const Coupon = require('../models/couponModel')


  
// load coupon 
const loadCoupon = async (req, res) => {
    try {

        const couponData = await Coupon.find()
        // console.log(couponData);
        res.render('admin/coupon', { couponData })

    } catch (error) {
        console.log(error);
    }
}



// add coupon
const addCouponLoad = async (req, res) => {
    try {


        res.render('admin/addCoupon')

    } catch (error) {
        console.log(error);
    }
}

const uploadCoupon = async (req, res) => {
    try {

        const coupon = new Coupon({
            code: req.body.couponCode,
            validFrom: req.body.validFromDate,
            expiry: req.body.expiryDate,
            discountAmount: req.body.discountAmount,
            minimumCartValue: req.body.minCartValue,
            is_listed: true
        })

        const couponData = await coupon.save()
        res.redirect('/admin/couponAdmin')

    } catch (error) {
        console.log(error);
    }
}


// Coupon List
const couponList = async (req, res) => {
    try {

        const couponID = req.params.couponID

        const coupon = await Coupon.findOne({ _id: couponID })
        if (!coupon) {
            return res.status(404).json({ error: 'coupon is not found' });
        }
        coupon.is_listed = true;
        await coupon.save()

        console.log('coupon listed successfully.');
        res.json({ message: 'coupon listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


// coupon Unlist
const couponUnlist = async (req, res) => {
    try {

        const couponID = req.params.couponID
        const coupon = await Coupon.findOne({ _id: couponID })
        if (!coupon) {
            return res.status(404).json({ error: 'coupon is not found' });
        }
        coupon.is_listed = false;
        await coupon.save()

        console.log('coupon listed successfully.');
        res.json({ message: 'coupon listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

// edit Coupon
const editCoupon = async (req, res) => {
    try {

        const couponId = req.query.id.trim();

        const couponData = await Coupon.findById({ _id: couponId })

        res.render('admin/editCoupon', { couponData })
    } catch (error) {
        console.log(error);
    }
}


// updated Coupon
const updatedCoupon = async (req, res) => {
    try {

        const couponId = req.body.couponId;

        const updateCoupon = await Coupon.findByIdAndUpdate({ _id: couponId },

            {
                $set: {
                    code: req.body.couponCode,
                    validFrom: req.body.validFromDate,
                    expiry: req.body.expiryDate,
                    discountAmount: req.body.discountAmount,
                    minimumCartValue: req.body.minCartValue,
                    is_listed: true
                }
            })

        res.redirect('/admin/couponAdmin');

    } catch (error) {
        console.log(error);
    }
}





module.exports = {

    // coupon
    loadCoupon,
    addCouponLoad,
    uploadCoupon,
    couponList,
    couponUnlist,
    editCoupon,
    updatedCoupon,


}