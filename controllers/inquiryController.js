import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req, res) {
    try {
        if (isItCustomer(req)) {
            const data = req.body;
            data.email = req.user.email; 
            data.phone = req.user.phone;

            let id = 1;
            const inquiries = await Inquiry.find().sort({ id: -1 }).limit(1);

            if (inquiries.length === 0) {
                id = 1;  // If the inquiries array is empty, start the ID at 1
            } else {  // Otherwise, assign the ID as one plus the ID of the first inquiry in the array
                id = parseInt(inquiries[0].id) + 1;
            }
            
            data.id = id.toString();  // Convert the ID to a string before assigning it to data
            


            const newInquiry = new Inquiry(data);
            const response = await newInquiry.save();

            res.json({
                message: "Inquiry saved successfully",
                id: response.id
            });

        } else {
            res.status(403).json({ message: "Unauthorized" });  
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add inquiry", error: error.message });
    }
}

export async function getInquiries(req, res) {
    try {
        if (isItCustomer(req)) {
            const inquiries = await Inquiry.find({ email: req.user.email });
            res.json(inquiries);
            return;
        } else if (isItAdmin(req)) {
            const inquiries = await Inquiry.find();
            res.json(inquiries);
            return;
        } else {
            res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to get inquiries"
        });
    }
}
export async function deleteInquiry(req, res) {
    try {
        const id = req.params.id; // Get the inquiry ID from the request parameters

        // Find the inquiry by ID (ensure you are querying based on the generated ID, not MongoDB _id)
        const inquiry = await Inquiry.findOne({ id: id });

        // Check if the inquiry exists
        if (!inquiry) {
            return res.status(404).json({
                message: "Inquiry not found"
            });
        }

        // If the user is an Admin, they can delete any inquiry
        if (isItAdmin(req)) {
            await Inquiry.deleteOne({ id: id });  // Admin can delete any inquiry
            return res.json({
                message: "Inquiry deleted successfully"
            });
        } 

        // If the user is a Customer, they can only delete their own inquiries
        if (isItCustomer(req)) {
            // Check if the logged-in customer owns the inquiry
            if (inquiry.email === req.user.email) {
                await Inquiry.deleteOne({ id: id });  // Customer can only delete their own inquiry
                return res.json({
                    message: "Inquiry deleted successfully"
                });
            } else {
                // If the inquiry email doesn't match the logged-in customer's email, deny access
                return res.status(403).json({
                    message: "You are not authorized to delete this inquiry"
                });
            }
        }

        // If neither admin nor customer, return unauthorized
        return res.status(403).json({
            message: "You are not authorized to perform this action"
        });

    } catch (error) {
        console.log(error);  // Log the error details for debugging
        res.status(500).json({ message: "Failed to delete inquiry", error: error.message });  // Return specific error message
    }
}   
export async function updateInquiry(req, res) {
    try {
        const id = req.params.id;  // Get the inquiry ID from the request parameters
        const data = req.body;  // Get the updated data from the request body

        if (isItAdmin(req)) {  // If the user is an admin
            // Admin can update any inquiry
            await Inquiry.updateOne({ id: id }, data);
            return res.json({
                message: "Inquiry updated successfully"
            });
        } else if (isItCustomer(req)) {  // If the user is a customer
            const inquiry = await Inquiry.findOne({ id: id });

            if (inquiry == null) {
                return res.status(404).json({
                    message: "Inquiry not found"
                });
            }

            if (inquiry.email === req.user.email) {  // Ensure the customer can only update their own inquiry
                await Inquiry.updateOne({ id: id }, { message: data.message });  // Update only the message field
                return res.json({
                    message: "Inquiry updated successfully"
                });
            } else {
                return res.status(403).json({
                    message: "You are not authorized to perform this action"
                });
            }
        } else {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update inquiry"
        });
    }
}
