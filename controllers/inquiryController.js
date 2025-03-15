import Inquiry from "../models/inquiry";
import { isItAdmin } from "./userController";

export async function addInquiry(req, res){
    try{
        if(isItAdmin(req)){
            
        }

    }catch(error){
        res.status(500).json({
            message : "Failed to add inquiry"
        })
    }
}