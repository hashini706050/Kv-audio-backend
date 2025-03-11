import { escape } from "querystring";
import Review from "../models/review.js";

export function addReview(req, res) {
    try{
        // Check if the user is authenticated
    if (req.user == null) {
        return res.status(401).json({
            message: "Please login and try again"
        });
    }

    const data = req.body;

    // Adding user info to the review data
    data.name = req.user.firstName + " " + req.user.lastName;
    data.profilePicture = req.user.profilePicture;
    data.email = req.user.email;
    
    // Creating a new review and saving it
    const newReview = new Review(data);
    
    // Save the review
    newReview.save()
        .then(() => {
            res.json({
                message: "Review added successfully"
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: "Review addition failed",
                details: error.message // It's helpful to include the error message
            });
        });

    }catch(error){
        res.status(500).json({message : "error occured"});
    }
    
}

export function getReview(req,res){
    try{
        const user = req.user;

    if(user == null || user.role != "admin"){
        Review.find({isApproved : true}).then((reviews)=>{
            res.json({reviews});
        }) 
        return       
    }
    if(user.role == "admin"){
        Review.find().then((reviews)=>{
            res.json(reviews);
        })
    }
    }catch(error){
        res.status(500).json({message : "error occured"})
    }
}

export default function deleteReview(req, res) {
   try{
    const email = req.params.email;

    if (req.user == null) {
        return res.status(401).json({
            message: "Please login and try again"
        });
    }

    if (req.user.role === "admin") {
        Review.deleteOne({ email: email }).then(() => {
            res.json({ message: "Review deleted successfully" });
        }).catch((error) => {
            res.status(500).json({
                error: "Review deletion failed",
                details: error.message
            });
        });
    }

    if (req.user.role === "customer") {
        if (req.user.email === email) {
            Review.deleteOne({ email: email }).then(() => {
                res.json({ message: "Review deleted successfully" });
            }).catch((error) => {
                res.status(500).json({
                    error: "Review deletion failed",
                    details: error.message
                });
            });
        } else {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    }
    
   }catch(error){
    res.status(500).json({message : "error occured"})
   } 
}

export function approvedReview(req, res) {
   try{
    const email = req.params.email;

    if (req.user == null) {
        res.status(401).json({
            message: "Please login and try again"
        });
        return;
    }

    if (req.user.role == "admin") {
        Review.updateOne(
            { email: email },
            { isApproved: true }
        )
        .then(() => {
            res.json({
                message: "Review approved successfully"
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: "Review approval failed",
                details: error.message
            });
        });
    } else {
        res.status(403).json({
            message: "You are not authorized to approve a review. Only admin users can approve reviews."
        });
    }

   }catch(error){
    res.status(500).json({message : "error occured"})
   }
}
