import express from 'express';
import cors from 'cors';
import Env from './config/confo.js';
import cookieParser from 'cookie-parser';
import paymentRoute from './routes/paymetRoutes.js';


const app = express();

app.use(cors({
    origin: Env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '50kb'

}))
app.use(express.static('public'));
app.use(cookieParser());

//routes
app.use('/api/payment', paymentRoute);

export { app };