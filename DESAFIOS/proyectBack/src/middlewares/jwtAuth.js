import jwt from "jsonwebtoken";

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return (
      res.status(401), send({ status: "Error", error: "Not authenticated" })
    );

  const token = authHeader.split("")[1];

  jwt.verify(token, "jwtUserSecret", (error, credentials) => {
    if (error)
      return res.status(401).send({ status: "Error", error: "Token invalid" });
    req.user = credentials.user;
    next();
  });
};
