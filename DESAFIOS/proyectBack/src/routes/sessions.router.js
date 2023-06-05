import {Router} from "express";
import UserManager from "../dao/mongo/Managers/users.js";

const usersService = new UserManager();

const router = Router();

router.post("/register", async (req,res) => {
    try {
        //i capture the user's fields
        const {first_name, last_name, email, password} = req.body;

        //i valid if the all fields are complete
        if(!first_name || !last_name || !email || !password) return res.status(404).send({status: "Error", error: "Incomplete fields"});
       
        //i valid if the user's email is not exist in the database
        const userExist = await usersService.findUser({email: email});     
        if(userExist) return res.status(404).send({status: "Error", error: "There is already a user with that email"})
        
        //add the user
        const userAdded = await usersService.addUser(req.body);
        res.status(200).send({status: "Success", payload: userAdded}) 
    } catch (error) {
        res.status(500).send({status: "Error", error: `user wasn't added correctly : ${error}`})
    }
})

router.post("/login", async (req,res) => {
    //i capture the user's fields
    const {email, password} = req.body;

    //i valid if the user is a admin
    if(email === "adminCoder@coder.com" && password === "123") {
        req.session.user = {
            name: "Administrador",
            role: "Administrator",
            email: "adminCoder@coder.com"
        }

       return res.status(200).send({status: "Success", message: "Successful login"})
    }

    //if the user exist i create a session but if no exist i send a error message
    const user = await usersService.logUser({email: email, password: password});
    if(!user) return res.status(404).send({status: "Error", error: "User not found"});
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
    }

    res.status(200).send({status: "Success", message: "Successful login"})
})
export default router;