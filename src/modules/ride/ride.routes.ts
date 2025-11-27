import { Router } from "express";
import { authenticateToken, authorizeRideAccess } from "../../middleware/authMiddleware";
import {
    createRide,
    getRide
} from "./ride.controller";

const router = Router();

/**
 * @swagger
 * /rides:
 *   post:
 *     summary: Create a new ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin_address
 *               - destination_address
 *               - origin_latitude
 *               - origin_longitude
 *               - destination_latitude
 *               - destination_longitude
 *               - ride_time
 *               - fare_price
 *               - payment_status
 *               - driver_id
 *             properties:
 *               origin_address:
 *                 type: string
 *               destination_address:
 *                 type: string
 *               origin_latitude:
 *                 type: number
 *               origin_longitude:
 *                 type: number
 *               destination_latitude:
 *                 type: number
 *               destination_longitude:
 *                 type: number
 *               ride_time:
 *                 type: integer
 *               fare_price:
 *                 type: number
 *               payment_status:
 *                 type: string
 *               driver_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ride created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateToken, createRide);

/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     summary: Get ride details
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride details
 *       403:
 *         description: Unauthorized
 */
router.get("/:id", authenticateToken, authorizeRideAccess, getRide);

export default router;
