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

            if (inquiries.length > 0) {
                id = parseInt(inquiries[0].id) + 1; 
            }

            data.id = id.toString();  

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

