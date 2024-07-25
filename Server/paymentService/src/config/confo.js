const Env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONDODB_URI || 'mongodb://localhost:27017',
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    razorpay_key_id: process.env.razorpay_key_id,
    razorpay_key_secret: process.env.razorpay_key_secret,
};

export default Env;
