import express from "express";
import { addProduct, getProduct, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", addProduct);
productRouter.get("/", getProduct);
productRouter.put("/:key", updateProduct)

export default productRouter;