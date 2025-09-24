const adminRouter = require("express").Router();
const AdminController = require("../controllers/Admin.controller");
const checkRole = require("../middleware/checkRole");
const verifyAccessToken = require("../middleware/verifyAccessToken");

adminRouter.get("/information", verifyAccessToken, checkRole("admin"), AdminController.getAllInformation)
  .get("/information/:id", verifyAccessToken, checkRole("admin"), AdminController.getInformationById)
  .post("/information", verifyAccessToken, checkRole("admin"), AdminController.createInformation)
  .put("/information/:id", verifyAccessToken, checkRole("admin"), AdminController.updateInformation)
  .delete("/information/:id", verifyAccessToken, checkRole("admin"), AdminController.deleteInformation)
  .get("/product", verifyAccessToken, checkRole("admin"), AdminController.getAllProducts)
  .get("/product/:id", verifyAccessToken, checkRole("admin"), AdminController.getProductById)
  .put("/product/:id", verifyAccessToken, checkRole("admin"), AdminController.updateProduct);

module.exports = adminRouter;
