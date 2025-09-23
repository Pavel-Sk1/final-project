const authRouter = require("express").Router();
const AuthController = require("../controllers/Auth.controller");

authRouter
  .get("/refreshTokens", AuthController.refreshTokens)
  .post("/signUp", AuthController.signUp)
  .post("/signIn", AuthController.signIn)
  .get("/signOut", AuthController.signOut);

module.exports = authRouter;
