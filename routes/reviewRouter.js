import express from "express";
import deleteReview, { addReview, approvedReview, getReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", addReview)
reviewRouter.get("/", getReview)
reviewRouter.get("/:name", 
    (req, res) => {
        console.log(req.params.name);
        res.send(`Name received: ${req.params.name}`);
    }
);
reviewRouter.delete("/:email", deleteReview)
reviewRouter.put("/approve/:email", approvedReview)

export default reviewRouter;