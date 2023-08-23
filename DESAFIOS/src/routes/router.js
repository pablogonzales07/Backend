import { Router } from "express";
import { passportCall } from "../services/auth.js";

export default class BaseRouter{
    constructor(){
        this.router = Router();
        this.init();
    }

    init(){};

    getRouter = () => this.router;
    
    get(path, policies, ...callbacks){
        this.router.get(path, passportCall("jwt", {strategyType: "jwt"}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks){
        this.router.post(path, passportCall("jwt", {strategyType: "jwt"}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }


    put(path, policies, ...callbacks){
        this.router.put(path, passportCall("jwt", {strategyType: "jwt"}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }


    delete(path, policies, ...callbacks){
        this.router.delete(path, passportCall("jwt", {strategyType: "jwt"}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }



    generateCustomResponses = (req, res, next) => {
        //Satisfactory request responses:               
        res.sendSuccess = message => res.send({status: "Success", message});
        res.sendPayload = payload => res.send({status: "Success", payload});

        //Error responses to requests:
        res.errorServer = error => res.status(500).send({status: "Error", error});
        res.badRequest = error => res.status(400).send({status: "Error", error});
        res.authentication = error => res.status(401).send({status: "Error", error});
        res.forbidden = error => res.status(403).send({status: "Error", error});
        res.notFounded = error => res.status(404).send({status: "Error", error})
        next();
    }

    handlePolicies = (policies) => {
        return(req,res,next) => {
            if(policies[0] === "PUBLIC") return next();
        
            const user = req.user;
            if(policies[0] === "NO_AUTH" && user) return res.redirect("/");
            if(policies[0] === "NO_AUTH" && !user) return next();

            if(policies[0] === "AUTH" && user) return next();
            if(policies[0] === "AUTH" && !user) return res.redirect("/login")

            console.log("fewfwefwefwef");
            if(!user) return res.status(401).send({status: "Error", error: req.error});
            if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({status:"Error", error: "The user is not authorized for enter in this view"})
            next();
        }
    }

    applyCallbacks = (callbacks) => {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].errorServer(error)
            }
        })
    }
}