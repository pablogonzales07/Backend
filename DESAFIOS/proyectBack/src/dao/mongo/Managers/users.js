import userModel from "../models/user.js";

export default class UserManager{

    addUser = (user) => {
        return userModel.create(user);
    }

    findUser = (fieldUser) => {
        return userModel.findOne(fieldUser)
    }
}