import userModel from "../models/user.js";

export default class UserManager{

    //Method to get all users
    get = () => {
        return userModel.find();
    }

    //Method to obtain a user according to the sent parameter
    getBy = (fieldUser) => {
        return userModel.findOne(fieldUser)
    }
    
    //Method to add a new user
    add = (user) => {
        return userModel.create(user);
    }

    //Method to delete a user
    delete = (userId) => {
        return userModel.findByIdAndDelete(userId);
    }
    
    //Method to change selected user´s any fields 
    update = (userId, user) => {
        return userModel.findByIdAndUpdate({_id: userId}, {$set: user})
    }

    //Method to change the user password
    changePassword = (userEmail, userPass) => {
        return userModel.updateOne({email : userEmail}, {$set: {password: userPass}})
    }

}