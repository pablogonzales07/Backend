import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { usersService } from "../services/repositories.js";
import {validatePassword,createHash,generateToken,} from "../services/auth.js";
import TokenDTO from "../dtos/user/tokenDTO.js";
import RestoreTokenDTO from "../dtos/user/restoreTokenDTO.js"
import MailingService from "../services/mailingService.js";
import DTemplates from "../constants/DTemplates.js";


//Controller for regist a new user
const registUser = async (req, res) => {
  res.sendSuccess("User registered correctly");
};

//Controller for user login
const loginUser = (req, res) => {
  try {
    //I make a data object transfer of the user
    const user = TokenDTO.getFrom(req.user);

    //I generate a token whit de user Data
    const accessToken = generateToken(user);
    console.log(accessToken);

    //I send the customer a cookie with the user token and a message
    res
      .cookie(config.cookie.SIGNATURE, accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .sendSuccess("User login correctly");
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for call the gitHub callback
const callGitHubRoute = (req, res) => {};

//Controller to log in the user whit gitHub
const loginGitHub = (req, res) => {
  try {
    //I make a data object transfer of the user
    const user = TokenDTO.getFrom(req.user);
    
    //Generate a token whit de user Data
    const accessToken = generateToken(user);

    //Send the customer a cookie with the user token and a message
    res
      .cookie(config.cookie.SIGNATURE, accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .redirect("/");
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller to send the password change request by email
const restoreRequest = async (req, res) => {
  try {
    //i get the user's email
    const { email } = req.body;

    //I verify if the user's email exist in the database
    const userExist = await usersService.getUserBy({ email: email });
    if (!userExist) return res.badRequest("User not found");

    //I generate a new token to have control over the user 
    const restoreToken = generateToken(RestoreTokenDTO.getFrom(userExist), "1h");

    //I build the email and then i send it
    const mailingService = new MailingService();
    const result = await mailingService.sendMail(userExist.email, DTemplates.RESTORE, {restoreToken})
    res.sendSuccess("Email sent successfully");
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for change the user´s password
const restorePassword = async (req,res) => {
  //I get the user's data
  const {password, token} = req.body;
  try {
    //I verify if the token is valid
    const tokenUser = jwt.verify(token, config.token.SECRET);

    //I get the user of the database
    const user = await usersService.getUserBy({email: tokenUser.email});

    //I verify if the new password is not match whit the before password
    const userPassword = await validatePassword(password, user.password);
    if (userPassword) return res.badRequest("The password is the same as above");

    //I hashed the new password
    const newPassword = await createHash(password);
    
    //I change the passsword
    await usersService.changeUserPassword(user.email, newPassword);  
    res.sendSuccess("The password was changed correctly")
  } catch (error) {
      return res.errorServer(error)
  }
}

//Controller fot logout user
const logoutUser = async (req, res) => {
  try {
    //I get the user
    const user = await usersService.getUserBy({email: req.user.email})

    //I save the user's logout time
    const currentDate = new Date();
    const date = currentDate.toDateString();        
    const time = currentDate.toTimeString();
    user.last_connection = `${date}: ${time}`;
    await usersService.updateUser(user._id, user);

    //I destroy the user's cookie
    res.cookie(config.cookie.SIGNATURE , "", { expires: new Date(0), httpOnly: true });
    res.sendSuccess("Closed session");
  } catch (error) {
    return res.errorServer(error);
  }
};

export default {
  registUser,
  loginUser,
  callGitHubRoute,
  loginGitHub,
  restoreRequest,
  restorePassword,
  logoutUser,
};
