import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken"

export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
  };
  
export const validatePassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);

export const passportCall = (strategy, options= {}) => {
    return async (req, res, next) => {
      passport.authenticate(strategy, (error, user, info) => {
        if (error) return next(error);
        if(!options.strategyType) {
          console.log(`the url ${req.url} doesn't have defined a strategyType`);
          return res.errorServer();
        }
        if (!user) {
         switch(options.strategyType){
          case "jwt":
            req.error = info.message?info.message:info.toString();
            return next();
          case "locals":
            return res.errorNotUser(info.message?info.message:info.toString())
         }
        }
        req.user = user;
        next();
      })(req, res, next);
    };
  };

export const generateToken = (user) => {
  const token = jwt.sign(user, "jwtUserSecret", { expiresIn: "24h" });
    return token;
  };