import {Router} from "express";
import passport from "passport";


const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail'}),async(req,res)=>{
    try {
    console.log(req.session.messages);
    res.send({status:"Success",message:"Registered"});
    } catch (error) {
        console.log(error);
    }

})

router.get('/registerFail',(req,res)=>{
    try {
        console.log(req.session.message);
        res.status(400).send({status:"Error", error: "fefwefwef"})
    } catch (error) {
        console.log(error);
    }

})

router.post("/login", async (req,res) => {
    req.session.user = {
        name: req.user.name,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email
    }
    return res.sendStatus(200);
})

router.get('/loginFail',(req,res)=>{
    console.log(req.session.messages);
    res.status(400).send({status:"error",error:req.session.messages});
})
export default router;