import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { Strategy, ExtractJwt } from "passport-jwt";

import { cartsService, usersService } from "../services/repositories.js";
import { createHash, validatePassword } from "../services/auth.js";
import { coockieExtractor } from "../utils.js";
import config from "../config/config.js";


const LocalStrategy = local.Strategy;

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          //I get the user's fields
          const { first_name, last_name, age} = req.body;
          
          //I verify if the all fields are complete
          if (!first_name || !last_name || !email || !password || !age )
            return done(null, false, { message: "Incomplete Fields" });

          //I verify if the email sent is a valid email
          const correctCredentials = /^[A-Za-z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/.test(email);
          if(!correctCredentials) return done(null, false, { message: "The email sent is invalid" })

          //I verify if the user's email is exist in the database
          const userExist = await usersService.getUserBy({ email: email });
          if (userExist)
            return done(null, false, {
              message: "There is already a user with that email",
            });

          //I hashed the password
          const hashedPassword = await createHash(password);

          //I verify that the password is secure
          const haveCapitalLetter = /[A-Z]/.test(password);
          const haveSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          const haveNumber = /[0-9]/.test(password);

          if(password.length <9) return done(null, false, {message: "The password must contain at least 8 digits"});
          if(!haveCapitalLetter) return done(null, false, {message: "The password must include at least one capital letter"});
          if(!haveSpecialCharacter) return done(null, false, {message: "The password must include at least one special character"});
          if(!haveNumber) return done(null, false, {message: "The password must include at least one number"});

          //I create a cart for the user
          const cartUser = await cartsService.addCart();
          
          //If the user is new, i create a discount code
          const codeDiscount = Math.round(Math.random()*999999);

          //I create the user
          const user = {
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword,
            cart: cartUser._id,
            discountCode: codeDiscount
          };

          //I add the user
          const userAdded = await usersService.addUser(user);
          done(null, userAdded);
        } catch (error) {
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
        if (email === config.admin.EMAIL && password === config.admin.PASSWORD) {
          const user = {
            id: 0,
            name: `Admin`,
            role: "admin",
            email: "...",
          };
          return done(null, user);     
        }

        let user;
        //I verify if the user exist
        user = await usersService.getUserBy({ email: email });
        if (!user)
          return done(null, false, {
            message: "There is not user registered with that email",
          });

        //I verify the encrypted password
        const passwordValid = await validatePassword(password, user.password);
        if (!passwordValid)
          return done(null, false, { message: "Incorrect Password" });

        //I save the user's login time
        const currentDate = new Date();
        const date = currentDate.toDateString();        
        const time = currentDate.toTimeString();
        user.last_connection = `${date}: ${time}`;
        await usersService.updateUser(user._id, user);

        //I create the user and send it
        user = {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          cartId: user.cart,
          discountCode: user.discountCode
        };
        return done(null, user);
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.f31caff0065cadfd",
        clientSecret: "0954a3a7db8d99824618aac70d004f69c197f09e",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //I capture the user info I need
          const { name, email } = profile._json;
  
          //If the user is not registered, I add it to the database; otherwise I create the session
          const userExist = await usersService.getUserBy({ email: email });
          if (!userExist) {
            const newUser = {
              first_name: name,
              email: email,
              password: "",
            };
            const result = await usersService.addUser(newUser);
            done(null, result);
          }
          const user = {
            id: userExist._id,
            name: `${userExist.first_name} ${userExist.last_name}`,
            email: userExist.email,
            role: userExist.role,
            cartId: userExist.cart,
            discountCode: userExist.discountCode
          };    
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use("jwt", new Strategy({
    jwtFromRequest: ExtractJwt.fromExtractors([coockieExtractor]),
    secretOrKey: "jwtUserSecret"
  }, async (payload, done) => {
    return done(null, payload)
  }))
};
export default initializePassportStrategies;
