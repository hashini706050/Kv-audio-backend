import Driver from "../models/driver.js";
import Delivery from "../models/delivery.js";

// Controller to assign a driver automatically to a delivery
export async function assignDriverAutomatically(req, res) {
    try {
        const { orderId } = req.body;

        // Find the delivery by orderId
        const delivery = await Delivery.findOne({ orderId });
        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        // Find an available driver
        const availableDriver = await Driver.findOne({ isAvailable: true });
        if (!availableDriver) {
            return res.status(404).json({ message: "No available drivers" });
        }

        // Assign the driver to the delivery
        delivery.driver = availableDriver.name;
        delivery.updatedAt = Date.now();
        await delivery.save();

        // Mark the driver as unavailable (if needed)
        availableDriver.isAvailable = false;
        await availableDriver.save();

        res.json({ message: "Driver assigned automatically", delivery });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
}
