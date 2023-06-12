import { Router } from "express";
import passport from "passport";
import UserManager from "../dao/mongo/Managers/users.js";
import { validatePassword, createHash } from "../utils.js";

const usersService = new UserManager();

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerFail",
    failureMessage: true,
  }),
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

router.get("/registerFail", (req, res) => {
  try {
    res.status(400).send({ status: "Error", error: req.session.messages });
  } catch (error) {
    res
      .status(500)
      .send({
        status: "Error in server",
        error: `Sorry, something went wrong : ${error}`,
      });
  }
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
    failureMessage: true,
  }),
  async (req, res) => {
    req.session.user = {
      name: req.user.name,
      role: req.user.role,
      id: req.user.id,
      email: req.user.email,
    };
    return res
      .status(200)
      .send({ status: "Success", message: "User login correctly" });
  }
);

router.get("/loginFail", (req, res) => {
  if (req.session.messages.length > 4)
    return res.status(400).send({ status: "Error", error: "too many tries" });
  res.status(400).send({ status: "Error", error: req.session.messages });
});

router.get("/github", passport.authenticate("github"),(req, res) => {})

router.get("/githubcallback", passport.authenticate("github"), (req, res) => {
  const user = req.user;
  console.log(user);

  req.session.user = {
    id: user.id,
    name: user.first_name,
    rol: user.rol,
    email: user.email
  }

  res.status(200).send({status: "Success", message: "Login whit github"})
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
});

export default router;
