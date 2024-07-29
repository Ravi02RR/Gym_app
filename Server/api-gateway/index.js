import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import CORS from 'cors';

const app = express();
app.use(CORS(
    {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    }
));


const postureservice = 'http://localhost:5000';
const userService = 'http://127.0.0.1:5000/';
const paymentService = 'http://localhost:8000';


app.use('/postureservice', createProxyMiddleware({
    target: postureservice,
    changeOrigin: true
}));
app.use('/userservice', createProxyMiddleware({
    target: userService,
    changeOrigin: true
}));
app.use('/paymentservice', createProxyMiddleware({
    target: paymentService,
    changeOrigin: true
}));


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});
