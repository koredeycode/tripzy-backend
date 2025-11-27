import { Router } from "express";
import { authenticateToken, authorizeUser } from "../../middleware/authMiddleware";
import {
    getUserRides,
    updateUser
} from "./user.controller";

const router = Router();

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Unauthorized
 */
router.put("/:id", authenticateToken, authorizeUser, updateUser);

/**
 * @swagger
 * /users/{id}/rides:
 *   get:
 *     summary: Get user rides
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user rides
 *       403:
 *         description: Unauthorized
 */
router.get("/:id/rides", authenticateToken, authorizeUser, getUserRides);

export default router;
