import UserManager from "../dao/mongo/Managers/users.js";
import { validatePassword, createHash, generateToken, passportCall } from "../services/auth.js";
import BaseRouter from "./router.js";

const usersService = new UserManager();

export default class SessionsRouter extends BaseRouter {
  init() {
    //Route for register users
    this.post("/register", ["NO_AUTH"], passportCall("register",{strategyType:"locals"}), (req,res) => {
      try {
        res.sendSuccess("User registered correctly")
      } catch (error) {
        res.errorServer(error);
      }
    })

    //Route for login user
    this.post("/login", ["NO_AUTH"], passportCall("login", {strategyType: "locals"}), (req,res) => {
      try {
        console.log(req.user);
        const user = {
          name: req.user.name,
          role: req.user.role,
          id: req.user.id,
          email: req.user.email,
        };
        const accessToken = generateToken(user);

        res.cookie("userCookie", accessToken, {
          maxAge: 1000*60*60*24,
          httpOnly: true
        }).sendSuccess("User login correctly")
      } catch (error) {
        res.errorServer(error);
      }
    })

    //Route for call github's route
    this.get("/github", ["NO_AUTH"], passportCall("github", {strategyType: "locals"}), (req,res) => {});

    //Route for login whit github
    this.get("/githubcallback", ["NO_AUTH"], passportCall("github", {strategyType: "locals"}), (req,res) => {
      try {
        const user = {
          name: req.user.name,
          role: req.user.role,
          id: req.user.id,
          email: req.user.email,
        };
        const accessToken = generateToken(user);
  
        res.cookie("userCookie", accessToken, {
          maxAge: 1000*60*60*24,
          httpOnly: true
        }).sendSuccess("User login correctly")
      } catch (error) {
        res.errorServer(error)
      }
    })

    //Route for restore the password
    this.post("/restorePassword", ["NO_AUTH"], async (req,res) => {
      //i capture the user's data
  const { email, password } = req.body;

  //i control if the user's email exist in the database
  const userExist = await usersService.findUser({ email: email });
  if (!userExist)
    return res.errorNotUser("User not found");

  //I check if the user's password is the same as the one I had
  const userPassword = await validatePassword(password, userExist.password);
  if (userPassword) return res.errorNotUser("the password is the same as above")

  //i hashed the new password
  const newPassword = await createHash(password);

  //i change the passsword
  await usersService.changePassword(email, newPassword);
  res.sendSuccess("Password changed correctly")

    })
  }
}



/* router.post("/register",passportCall("register"),
  async (req, res) => {
    try {
      //sent that the user registered correctly
      res.send({ status: "Success", message: "User registered correctly" });
    } catch (error) {
      res
        .status(500)
        .send({
          status: "Error in server",
          error: `Sorry, something went wrong : ${error}`,
        });
    }
  }
);

router.post(
  "/login",passportCall("login"), async (req, res) => {
    const user = {
      name: req.user.name,
      role: req.user.role,
      id: req.user.id,
      email: req.user.email,
    };
    const accessToken = generateToken(user);

    res.cookie("userCookie", accessToken, {
      maxAge: 1000*60*60*24,
      httpOnly: true
    }).status(200).send({status: "Success", message: "User login correctly"})
  }
);

router.get("/github", passportCall("github"),(req, res) => {})

router.get("/githubcallback", passportCall("github"), (req, res) => {
  const user = {
    name: req.user.name,
    role: req.user.role,
    id: req.user.id,
    email: req.user.email,
  };
  const accessToken = generateToken(user);
  res.cookie("userCookie", accessToken, {
    maxAge: 1000*60*60*24,
    httpOnly: true
  }).status(200).send({status: "Success", message: "User login correctly"})
});

router.post("/restorePassword", async (req, res) => {
  //i capture the user's data
  const { email, password } = req.body;

  //i control if the user's email exist in the database
  const userExist = await usersService.findUser({ email: email });
  if (!userExist)
    return res.status(400).send({ status: "Error", error: "User not found" });

  //I check if the user's password is the same as the one I had
  const userPassword = await validatePassword(password, userExist.password);
  if (userPassword)
    return res
      .status(400)
      .send({ status: "Error", error: "the password is the same as above" });

  //i hashed the new password
  const newPassword = await createHash(password);

  //i change the passsword
  await usersService.changePassword(email, newPassword);
  res
    .status(200)
    .send({ status: "Success", message: "Password changed correctly" });
}); */


