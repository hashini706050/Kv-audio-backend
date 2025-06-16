import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    recipientName: {  
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    streetAddress: {  
        type: String,
        required: true
    },
    streetAddressLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {  
        type: String,
        required: true
    },
    deliveryStatus: {  
        type: String,
        enum: ["Pending", "Shipped", "Delivered"],
        default: "Pending"
    },
    createdAt: {  
        type: Date,
        default: Date.now
    },
    driver: {  // New field to store the assigned driver's information
        type: String,  // Can also be an Object or Reference to a Driver model
        required: false
    }
});

// Pre-save hook to concatenate the full address before saving
deliverySchema.pre('save', function(next) {
    const fullAddress = `${this.streetAddress} ${this.streetAddressLine2 ? this.streetAddressLine2 + ', ' : ''}${this.city}`;
    this.fullAddress = fullAddress;
    next();
});

// Use mongoose.models to prevent model overwrite error
const Delivery = mongoose.models.Delivery || mongoose.model("deliveries", deliverySchema);

export default Delivery;
