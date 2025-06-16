import express from "express";
import { addDeliveryInformations, deleteDelivery, getAllDeliveryInformation, updateDeliveryDetails } from "../controllers/deliveryController.js";

const deliveryRouter = express.Router();

deliveryRouter.post("/", addDeliveryInformations);
deliveryRouter.get("/", getAllDeliveryInformation);
deliveryRouter.put("/", updateDeliveryDetails);
deliveryRouter.delete("/:id", deleteDelivery);

export default deliveryRouter;