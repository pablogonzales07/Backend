import passport from "passport";
import local from "passport-local";

import UserManager from "../dao/mongo/Managers/users.js"
import { createHash, validatePassword } from "../utils.js";


const LocalStrategy = local.Strategy;
const usersService = new UserManager();

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          //i capture the user's fields
          const { first_name, last_name } = req.body;

          //i valid if the all fields are complete
          if (!first_name || !last_name || !email || !password) return done(null, false, { message: "Incomplete Fields" });

          //i valid if the user's email is not exist in the database
          const userExist = await usersService.findUser({email:email})
          if (userExist)
            return done(null, false, {
              message: "There is already a user with that email",
            });

          //I hashed the password
          const hashedPassword = await createHash(password);

          //I create the user
          const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
          };

          //add the user
          const userAdded = await usersService.addUser(user);
          done(null, userAdded, {message: "ggregergergwerg"});
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {

        if (email === "admin@admin.com" && password === "123") {
          const user = {
            id: 0,
            name: `Admin`,
            role: "admin",
            email: "...",
          };
          return done(null, user);
        }

        let user;

        //I valid if the user exist
        user = await usersService.findUser({email: email});
        if (!user)
          return done(null, false, { message: "there is not user registered with that email"});

        //I verify the encrypted password

        const passwordValid = await validatePassword(password, user.password);
        if (!passwordValid)
          return done(null, false, { message: "Incorrect Password" });

        //Número 3!!! ¿El usuario existe y SÍ PUSO SU CONTRASEÑA CORRECTA? Como estoy en passport, sólo devuelvo al usuario

        user = {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
        };
        return done(null, user);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });
  passport.deserializeUser(async function (id, done) {
    if (id === 0) {
      return done(null, {
        role: "admin",
        name: "ADMIN",
      });
    }
    const user = await userModel.findOne({ _id: id });
    return done(null, user);
  });
};
export default initializePassportStrategies;
