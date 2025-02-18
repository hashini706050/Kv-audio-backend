import express from "express";
import { getStudents } from "../controllers/studentController.js";
import { postStudents } from "../controllers/studentController.js";

let StudentRouter = express.Router();

StudentRouter.get("/", getStudents)

StudentRouter.post("/", postStudents)

export default StudentRouter;
