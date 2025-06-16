import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    driverId: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    }
});

const Driver = mongoose.models.Driver || mongoose.model("drivers", driverSchema);

export default Driver;
