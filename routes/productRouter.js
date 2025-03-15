import express from "express";
import { addProduct, deleteProduct, getProduct, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", addProduct);
productRouter.get("/", getProduct);
productRouter.put("/:key", updateProduct);
productRouter.delete("/:key", deleteProduct);

export default productRouter;