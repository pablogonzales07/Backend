import userModel from "../models/user.js";

export default class UserManager{

    addUser = (user) => {
        return userModel.create(user);
    }

    logUser = (userEmail, userPassword) => {
        return userModel.findOne(userEmail, userPassword)
    }

    findUser = (fieldUser) => {
        return userModel.findOne(fieldUser)
    }
}