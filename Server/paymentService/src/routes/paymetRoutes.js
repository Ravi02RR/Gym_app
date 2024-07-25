import express from 'express';
import { checkout } from '../controllers/paymentController.js';

const paymentRoute = express.Router();
paymentRoute.route("/checkout").post(checkout);

export default paymentRoute;