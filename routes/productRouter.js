import express from "express";
import { addProduct, deleteProduct, getProduct, getProductKey, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", addProduct);
productRouter.get("/", getProduct);
productRouter.put("/:key", updateProduct);
productRouter.delete("/:key", deleteProduct);
productRouter.get("/:key", getProductKey);

export default productRouter;
