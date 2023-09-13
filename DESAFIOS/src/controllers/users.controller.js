import { usersService } from "../services/repositories.js";
import config from "../config/config.js";

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
    if (!userExist) return res.badRequest("The user isn't exist");

    //Valid if the user is already a premium user
    if (userExist.role === "Premium")
      return res.badRequest("The user is already premium");

    //Valid if the user has the necessary documents
    const documentsUser = userExist.documents.map((doc) => {
      return `${doc.name}`;
    });
    if (
      documentsUser.length < 1 ||
      !documentsUser.includes("userDni") ||
      !documentsUser.includes("proofAddress") ||
      !documentsUser.includes("accountStatus")
    ) {
      return res.badRequest("incomplete user documents");
    }

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
  //I verify if the codes match
  if (user.discountCode !== discountCodeUsed)
    return res.badRequest("The code doesn't match whit de user code");

  const newCodeForUse = Math.round(Math.random() * 999999);
  const updateUserCode = await usersService.updateUser(user.id, {
    discountCode: newCodeForUse,
  });
  res.sendSuccess("The code was used correctly");
};

//Controller for add user documents
const addUserDocuments = async (req, res) => {
  //Bring the user
  const userId = req.params.uid;
  const users = await usersService.getAllUsers();
  const userExist = users.find((user) => user.id === userId);

  //Send an error if the user doesn't exist in the database
  if (!userExist) return res.notFounded("User not found");

  //I bring the sent documents and then save them in the database according to the type
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
  userExist.documents = documents
  
  //Update the user whit the new documents
  await usersService.updateUser(userId, userExist);
  res.sendSuccess("files uploaded successfully");
};

export default {
  getUser,
  changeRoleUser,
  usingDiscountCode,
  addUserDocuments,
};
