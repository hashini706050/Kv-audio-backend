import Delivery from "../models/delivery.js";  // Import Delivery only once

export async function addDeliveryInformations(req, res) {
    try {
        // Check if the user is authenticated as a customer
        if (!req.user) {
            return res.status(401).json({ message: "Please login to submit delivery information." });
        }

        // Extract delivery info from request body
        const { orderId, recipientName, phoneNumber, streetAddress, streetAddressLine2, city, state, postalCode } = req.body;

        // Validate required fields
        if (!orderId || !recipientName || !phoneNumber || !streetAddress || !city || !state || !postalCode) {
            return res.status(400).json({ message: "Missing required delivery information" });
        }

        // Create new delivery entry with "Pending" status
        const newDelivery = new Delivery({
            orderId,
            Name,
            phoneNumber,
            streetAddress,
            streetAddressLine2,
            city,
            state,
            postalCode,
            deliveryStatus: "Pending",  // Default status
        });

        // Save the delivery to the database
        await newDelivery.save();
        res.json({ message: "Delivery information saved successfully, waiting for admin confirmation." });

    } catch (error) {
        res.status(500).json({ message: "Failed to add delivery information", details: error.message });
    }
}

export async function getAllDeliveryInformation(req, res) {
    try {
        // Only allow admin to view the delivery information
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Only admins can view delivery information" });
        }

        // Get all deliveries from the database
        const deliveries = await Delivery.find();
        res.json(deliveries);

    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
}

export async function updateDeliveryDetails(req, res) {
    try {
        const { orderId, deliveryStatus, recipientName, phoneNumber, streetAddress, streetAddressLine2, city, state, postalCode } = req.body;

        // Check if the user is an admin
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Only admins can update delivery details" });
        }

        // Validate delivery status
        const validStatuses = ["Pending", "Shipped", "Delivered"];
        if (deliveryStatus && !validStatuses.includes(deliveryStatus)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Prepare update fields
        const updateFields = {
            Name,
            phoneNumber,
            streetAddress,
            streetAddressLine2,
            city,
            state,
            postalCode,
            deliveryStatus,  // Admin can change this
            updatedAt: Date.now(),
        };

        // Update the delivery information
        const updatedDelivery = await Delivery.findOneAndUpdate({ orderId }, updateFields, { new: true });
        if (!updatedDelivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        res.json({
            message: "Delivery information updated successfully",
            delivery: updatedDelivery,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
}
export async function deleteDelivery(req, res) {
    try {
        // Check if the user is an admin (assuming you have an `isItAdmin` function)
        if (isItAdmin(req)) {
            const orderId = req.params.orderId; // Assuming the orderId is passed as a URL parameter

            // Delete the delivery information using the orderId
            const deletedDelivery = await Delivery.deleteOne({ orderId: orderId });

            // Check if the delivery was found and deleted
            if (deletedDelivery.deletedCount === 0) {
                return res.status(404).json({
                    message: "Delivery not found"
                });
            }

            // Respond with a success message
            res.json({
                message: "Delivery information deleted successfully"
            });

        } else {
            res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete delivery information",
            details: error.message // Provide details for debugging
        });
    }
}

export async function assignDriverToDelivery(req, res) {
    try {
        const { orderId, driverName } = req.body;

        // Find the delivery by orderId
        const delivery = await Delivery.findOne({ orderId });
        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        // Update the delivery with the driver
        delivery.driver = driverName;
        delivery.updatedAt = Date.now();
        await delivery.save();

        res.json({ message: "Driver assigned successfully", delivery });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
}

