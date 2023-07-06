import UserManager from "../dao/mongo/Managers/users.js";
import { validatePassword, createHash, generateToken } from "../services/auth.js";
const usersService = new UserManager();

const registUser = () => {
  try {
    res.sendSuccess("User registered correctly");
  } catch (error) {
    res.errorServer(error);
  }
};

const loginUser = () => {
  try {
    const user = {
      name: req.user.name,
      role: req.user.role,
      id: req.user.id,
      email: req.user.email,
    };

    const accessToken = generateToken(user);
    res
      .cookie("userCookie", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .sendSuccess("User login correctly");
  } catch (error) {
    res.errorServer(error);
  }
};

const callGitHubRoute = (req, res) => {};

const loginGitHub = () => {
  try {
    const user = {
      name: req.user.name,
      role: req.user.role,
      id: req.user.id,
      email: req.user.email,
    };
    const accessToken = generateToken(user);

    res
      .cookie("userCookie", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .redirect("/products");
  } catch (error) {
    res.errorServer(error);
  }
};

const restorePass = async (req, res) => {
  try {
    //i capture the user's data
    const { email, password } = req.body;

    //i control if the user's email exist in the database
    const userExist = await usersService.findUser({ email: email });
    if (!userExist) return res.errorNotUser("User not found");

    //I check if the user's password is the same as the one I had
    const userPassword = await validatePassword(password, userExist.password);
    if (userPassword)
      return res.errorNotUser("the password is the same as above");

    //i hashed the new password
    const newPassword = await createHash(password);

    //i change the passsword
    await usersService.changePassword(email, newPassword);
    res.sendSuccess("Password changed correctly");
  } catch (error) {
     res.status(500).send(error)
  }
};

export default {
  registUser,
  loginUser,
  callGitHubRoute,
  loginGitHub,
  restorePass
};
