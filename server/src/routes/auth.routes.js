const authRouter = require("express").Router();
const AuthController = require("../controllers/Auth.controller");
const checkRole = require("../middleware/checkRole");
const verifyAccessToken = require("../middleware/verifyAccessToken");

authRouter
  .get("/refreshTokens", AuthController.refreshTokens)
  .post("/signIn", AuthController.signIn)
  .get("/signOut", AuthController.signOut)
  .post("/signUp",verifyAccessToken, checkRole("admin"), AuthController.signUp)
  .put("/updateUser/:id", verifyAccessToken, checkRole("admin"), AuthController.updateUser)
  .delete("/deleteUser/:id", verifyAccessToken, checkRole("admin"), AuthController.deleteUser);

module.exports = authRouter;
