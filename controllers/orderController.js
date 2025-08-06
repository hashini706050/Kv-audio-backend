import { error } from "console";
import Order from "../models/order.js";
import Product from "../models/product.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function createOrder(req, res){
    const data = req.body;

    const orderInfo = {
        orderedItems : [] 
    }

    if(req.user == null){
        res.status(401).json({
            message : "Please login and try again"
        })
    }

    orderInfo.email = req.user.email;

    const lastOrder = await Order.find().sort({ orderDate: -1 }).limit(1);
    console.log(lastOrder)

    if(lastOrder.length == 0){
        orderInfo.orderId = "ORD0001";
    }else{
        const lastOrderId = lastOrder[0].orderId;//"ORD0065"
        const lastOrderNumberInString = lastOrderId.replace("ORD","");//"0065"
        const lastOrderNumber = parseInt(lastOrderNumberInString);//65
        const crrentOrderNumber = lastOrderNumber + 1;//66
        const formattedNumber = String(crrentOrderNumber).padStart(4, '0');//"0065"
        orderInfo.orderId = "ORD" + formattedNumber;
    }

    let oneDayCost = 0;

    for(let i=0; i<data.orderedItems.length; i++){

        try{

            const product = await Product.findOne({key : data.orderedItems[i].key})
            if(product === null){
                console.log("DEBUG: Product not found for key:", data.orderedItems[i].key); // debug log
                res.status(404).json({
                    message : "Product with key"+data.orderedItems[i].key+" not found"
                })
                return
            }

            if(product.availability == false){
                res.status(400).json({
                    message : "Product with key "+data.orderedItems[i].key+" is not availiable"
                })
                return
            }
            orderInfo.orderedItems.push({
                product : {
                    key : product.key,
                    name : product.name,
                    image : product.image[0],   
                    price : product.price
                },
                quantity : data.orderedItems[i].qty
            })

            oneDayCost += product.price * data.orderedItems[i].qty;



        }catch(e){
            console.error("ERROR creating order item:", e); // log actual error
            res.status(500).json({
                message : "Failed to create order.try again",
                error: e.message
               
            })
            return
        }
    }

    orderInfo.days=data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days; // Not totalCost

    try{
        orderInfo.status = "pending"; // default status

        const newOrder = new Order(orderInfo);
        await newOrder.save();
        res.json({
            message : "Order created successfully"
        })
    }catch(e){
        res.status(500).json({
            message : "Failed to create order"
        })
    }

}

export async function getQuote(req,res){
    const data = req.body;

    const orderInfo = {
        orderedItems : [] 
    };

    let oneDayCost = 0;

    for(let i=0; i<data.orderedItems.length; i++){

        try{

            const product = await Product.findOne({key : data.orderedItems[i].key})
            if(product === null){
                console.log("DEBUG: Product not found for key:", data.orderedItems[i].key); // debug log
                res.status(404).json({
                    message : "Product with key"+data.orderedItems[i].key+" not found"
                })
                return
            }

            if(product.availability == false){
                res.status(400).json({
                    message : "Product with key "+data.orderedItems[i].key+" is not availiable"
                })
                return
            }
            orderInfo.orderedItems.push({
                product : {
                    key : product.key,
                    name : product.name,
                    image : product.image[0],   
                    price : product.price
                },
                quantity : data.orderedItems[i].qty
            })

            oneDayCost += product.price * data.orderedItems[i].qty;

        }catch(e){
            console.error("ERROR creating order item:", e); // log actual error
            res.status(500).json({
                message : "Failed to create order.try again",
                error: e.message
               
            })
            return
        }
    }

    orderInfo.days=data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days; // Not totalCost

    try{
        res.json({
            message : "Order created successfully",
            total : orderInfo.totalAmount,
        })
    }catch(e){
        res.status(500).json({
            message : "Failed to create order"
        })
    }
}

export async function getOrders(req, res) {
    console.log(req.data)
    if(isItCustomer(req)){
        try{
            const orders = await Order.findOne({email : req.user.email})
            res.json(orders);

        }catch(e){
            res.status(500).json({error : "failed to load order"})

        }
    }else if(isItAdmin(req)){
        try{
            const orders = await Order.find();
            res.json(orders);
        }catch(e){
            res.status(500).json({error: "Unauthorized login attempt"})
        }

    }
    
}

export async function approveOrRejectOrder(req, res) {
  const orderId = req.params.orderId;
  const status = req.body.status; // ✅ FIXED

  if (isItAdmin(req)) {
    try {
      const order = await Order.findOne({ orderId: orderId });

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      await Order.updateOne(
        { orderId: orderId },
        {
          $set: {
            status: status,
            isApproved: status === "Approved" ? "true" : "false",
          },
        }
      );

      res.json({ message: "Order approved/rejected successfully" });
    } catch (e) {
      res.status(500).json({ error: "Failed to get order" });
    }
  } else {
    res.status(403).json("Unauthorized");
  }
}

