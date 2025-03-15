import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'; 

export function registerUser(req, res) {
    try{
        const userData = req.body;

    userData.password = bcrypt.hashSync(userData.password, 10);

    const newUser = new User(userData);

    newUser.save()
        .then(() => {
            res.json({
                message: "User registered successfully"
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: "User registration failed",
                details: error.message || error
            });
        });
    }catch(error){
        res.status(500).json({message : "error occured"})
    }
}

export function loginUser(req, res) {
    try{
        const data = req.body;

    User.findOne({ 
        email: data.email 
    }).then((user) => {
        if (user == null){
            res.status(500).json({error : "User not found"});
        }else{

            const isPasswordCorrect = (bcrypt.compareSync(data.password,user.password));

            if(isPasswordCorrect){

                const token = jwt.sign({
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email,
                    role : user.role,
                    profilePicture : user.profilePicture
                },process.env.JWT_SECRET)
                res.json({message:"Login Successful", token : token});

            }else{
                res.status(403).json({message:"Login Unsuccessfull"});
            }
        }
    }
)
    }catch(error){
        res.status(500).json({message : "error occured"})
    }
};


export function isItAdmin(req)
{
    let isAdmin = false;

    if(req.user != null){
        if(req.user.role = "admin"){
            isAdmin = true;
        }
    }
    return isAdmin;
};
