import { usersService } from "../services/repositories.js";

//Controller for obtein the user's data
const getUser = (req, res) => {
    try {
      //I send the user
      const user = req.user;
      res.sendPayload(user);
    } catch (error) {
      res.errorServer(error);
    }
  };
  
  //Controller for change the user role
  const changeRoleUser = async (req, res) => {
    try {
      //I capture the required data
      const uid = req.params.uid;
      const users = await usersService.getAllUsers();
      const userExist = users.find((user) => user.id === uid);
  
  
      //Valid if the user already exists
      if (!userExist) return res.errorUser("The user isn't exist");
  
      //Valid if the user is already a premium user
      if (userExist.role === "Premium")
        return res.errorUser("The user is already premium");
  
      //I change the user role
      userExist.role = "Premium";
      const updateUserRole = await usersService.updateUser(uid, userExist);
      res.sendSuccess("the user's role was changed correctly");
    } catch (error) {
      return res.errorServer(error);
    }
  };

  //Controller for when the user consumes the discount code
  const usingDiscountCode = async (req, res) => {
    //I bring the neccesary data
    const user = req.user;
    const discountCodeUsed = parseInt(req.body.discountCode);
    console.log(discountCodeUsed);
    //I verify if the codes match
    if(user.discountCode !== discountCodeUsed) return res.badRequest("The code doesn't match whit de user code");

    const newCodeForUse = Math.round(Math.random()*999999);
    const updateUserCode = await usersService.updateUser(user.id, {discountCode: newCodeForUse});
    res.sendSuccess("The code was used correctly");
  }

  export default {
    getUser,
    changeRoleUser,
    usingDiscountCode
  }