import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    height: Number
});

// Prevent multiple model registration
const Student = mongoose.models.Student || mongoose.model("students", studentSchema);

export default Student;