import Razorpay from 'razorpay';
import Env from '../config/confo.js';

const razorpayInstance = new Razorpay({
    key_id: Env.razorpay_key_id,
    key_secret: Env.razorpay_key_secret
})

export default razorpayInstance;