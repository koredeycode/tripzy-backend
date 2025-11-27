import { Router } from "express";
import chatRoutes from "../modules/chat/chat.routes";
import driverRoutes from "../modules/driver/driver.routes";
import rideRoutes from "../modules/ride/ride.routes";
import stripeRoutes from "../modules/stripe/stripe.routes";
import userRoutes from "../modules/user/user.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

router.use("/users", userRoutes);
router.use("/rides", rideRoutes);
router.use("/drivers", driverRoutes);
router.use("/stripe", stripeRoutes);
router.use("/chat", chatRoutes);

export default router;
