import express from "express";
import paymentController from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment integration
 */

/**
 * @swagger
 * /api/v1/payments/intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId]
 *             properties:
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Intent created successfully
 *       400:
 *         description: Already paid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment record not found
 */
router.post("/intent", protect, paymentController.createPaymentIntent);

/**
 * @swagger
 * /api/v1/payments/confirm:
 *   post:
 *     summary: Confirm a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentId]
 *             properties:
 *               paymentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment record not found
 */
router.post("/confirm", protect, paymentController.confirmPayment);

/**
 * @swagger
 * /api/v1/payments/user-payments:
 *   get:
 *     summary: Get logged-in user's payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: server error
 */
router.get("/user-payments", protect, paymentController.getUserPayments);

export default router;
