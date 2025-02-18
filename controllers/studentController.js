import Student from "../models/student.js";

// GET request handler
export function getStudents(req, res) {
    Student.find()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching students", error: error.message });
        });
}

// POST request handler
export function postStudents(req, res) {
    let StudentData = req.body

    let student = new Student(StudentData)

    student.save().then(() => {
        res.json(
            {
                message : "Student saved successfully"
        })
    })
}
