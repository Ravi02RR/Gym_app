import razorpayInstance from '../utils/razorpayInstance.js';
export const checkout = async (req, res) => {
    const options = {
        amount: req.body.amount * 100,
        currency: 'INR',
        receipt: `receipt_order_1`,
        payment_capture: 1
    }
    try {
        const order = await razorpayInstance.orders.create(options);
        console.log(order);
        res.status(200).json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            success: true
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}