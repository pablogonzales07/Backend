import { usersService } from "../services/repositories.js";
import config from "../config/config.js";
import MainDataDTO from "../dtos/user/mainDataDTO.js";

//Controller for obtein all the users in the dataBase
const getAllUsers = async (req, res) => {
  try {
    //I get the users and then capture only main data
    const users = await usersService.getAllUsers();
    const usersMainData = users.map((user) => {
      return MainDataDTO.getFrom(user);
    });

    //I send the users
    res.sendPayload(usersMainData);
  } catch (error) {
    return res.errorServer(500);
  }
};

//Controller to get the user information in the current session
const getSessionUser = (req, res) => {
  try {
    //I get the user and then send it
    const user = req.user;
    res.sendPayload(user);
  } catch (error) {
    res.errorServer(error);
  }
};

//Controller for obtein a specefic user
const findUser = async (req, res) => {
  try {
    //I get the required data
    const userId = req.params.uid;

    //I find the user in the database and then i verify if the user exist
    const users = await usersService.getAllUsers();
    const userExist = users.find((user) => user.id === userId);
    if (!userExist) return res.notFounded("User not found");

    //I send the user
    res.sendPayload(userExist);
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for change the user role to premium
const changeRoleUserPremium = async (req, res) => {
  try {
    //I get the required data
    const uid = req.params.uid;
    const users = await usersService.getAllUsers();
    const userExist = users.find((user) => user.id === uid);

    //I verify if the user already exists
    if (!userExist) return res.badRequest("The user isn't exist");

    //I verify if the user is already a premium user
    if (userExist.role === "Premium")
      return res.badRequest("The user is already premium");

    //I verify if the user has the necessary documents
    const documentsUser = userExist.documents.map((doc) => {
      return `${doc.name}`;
    });
    if (
      documentsUser.length < 1 ||
      !documentsUser.includes("userDni") ||
      !documentsUser.includes("proofAddress") ||
      !documentsUser.includes("accountStatus")
    ) {
      return res.badRequest("Incomplete user documents");
    }

    //I change the user role
    userExist.role = "PREMIUM";
    const updateUserRole = await usersService.updateUser(uid, userExist);
    res.sendSuccess("The user's role was changed correctly");
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for change the user role
const changeRoleUser = async (req, res) => {
  try {
    //I get the neccesary data
    const userId = req.params.uid;
    const newRole = req.body.roleUser;

    //I verify if the client sent the required data
    if (!newRole) return res.badRequest("Incomplete data");

    //I verify if the submitted role is included in the company's roles
    const allowedRoles = ["USER", "PREMIUM", "ADMIN"];
    if (!allowedRoles.includes(newRole.toUpperCase()))
      return res.badRequest("The role isn't include in the roles of the site");

    //I get the users from the database and then validate if the submitted user is found.
    const users = await usersService.getAllUsers();
    const userExist = users.find((user) => user.id === userId);
    if (!userExist) return res.badRequest("User not found in the dataBase");

    //I verify if the user role is the same as the sent one
    if (userExist.role === newRole)
      return res.badRequest("The role sent matches the user's current role");

    //I change the user role
    userExist.role = newRole.toUpperCase();
    await usersService.updateUser(userId, userExist);
    res.sendSuccess("The user role was changed correctly");
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for the use of the user's discount code
const usingDiscountCode = async (req, res) => {
  try {
    //I get the neccesary data
    const user = req.user;
    const discountCodeUsed = parseInt(req.body.discountCode);

    //I verify if the codes match
    if (user.discountCode !== discountCodeUsed)
      return res.badRequest("The code doesn't match whit de user code");

    //If the code sent matches, I generate a new one.
    const newCodeForUse = Math.round(Math.random() * 999999);
    const updateUserCode = await usersService.updateUser(user.id, {
      discountCode: newCodeForUse,
    });
    res.sendSuccess("The code was used correctly");
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for add user documents
const addUserDocuments = async (req, res) => {
  try {
    //I get the user
    const userId = req.params.uid;
    const users = await usersService.getAllUsers();
    const userExist = users.find((user) => user.id === userId);

    //I send an error if the user doesn't exist in the database
    if (!userExist) return res.notFounded("User not found");

    //I get the sent documents and then save them in the database according to the type
    const files = req.files;
    const documents = userExist.documents;
    if (files["profileUser"]) {
      const newDocument = {
        name: "UserProfile",
        reference: `https://localhost:${config.app.PORT}/profiles/${files["profileUser"][0].filename}`,
      };
      documents.push(newDocument);
    }
    if (files["productImage"]) {
      const newDocument = {
        name: "ProductImage",
        reference: `https://localhost:${config.app.PORT}/products/${files["productImage"][0].filename}`,
      };
      documents.push(newDocument);
    }
    if (files["userDni"]) {
      const newDocument = {
        name: "userDni",
        reference: `https://localhost:${config.app.PORT}/documents/${files["userDni"][0].filename}`,
      };
      documents.push(newDocument);
    }
    if (files["accountStatus"]) {
      const newDocument = {
        name: "accountStatus",
        reference: `https://localhost:${config.app.PORT}/documents/${files["accountStatus"][0].filename}`,
      };
      documents.push(newDocument);
    }
    if (files["proofAddress"]) {
      const newDocument = {
        name: "proofAddress",
        reference: `https://localhost:${config.app.PORT}/documents/${files["proofAddress"][0].filename}`,
      };
      documents.push(newDocument);
    }
    userExist.documents = documents;

    //I update the user whit the new documents
    await usersService.updateUser(userId, userExist);
    res.sendSuccess("files uploaded successfully");
  } catch (error) {
    return res.errorServer(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    //I get the neccesary data
    const userId = req.params.uid;
    const users = await usersService.getAllUsers();

    //I verify if the user is exist in the database
    const userExist = await users.find((user) => user.id === userId);
    if (!userExist) return res.notFounded("User not found");

    //I delete the user
    await usersService.deleteUser(userId);
    res.sendSuccess("The user was deleted correctly");
  } catch (error) {
    return res.errorServer(error);
  }
};

export default {
  getAllUsers,
  getSessionUser,
  findUser,
  changeRoleUserPremium,
  changeRoleUser,
  usingDiscountCode,
  addUserDocuments,
  deleteUser,
};
