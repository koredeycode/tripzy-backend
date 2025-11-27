import { Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import {
    getDriver,
    getDrivers
} from "./driver.controller";

const router = Router();

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drivers
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, getDrivers);

/**
 * @swagger
 * /drivers/{id}:
 *   get:
 *     summary: Get driver details
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver details
 *       404:
 *         description: Driver not found
 */
router.get("/:id", authenticateToken, getDriver);

export default router;
