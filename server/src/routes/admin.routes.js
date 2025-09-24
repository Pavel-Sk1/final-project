const adminRouter = require("express").Router();
const AdminController = require("../controllers/Admin.controller");
const checkRole = require("../middleware/checkRole");
const verifyAccessToken = require("../middleware/verifyAccessToken");

// verifyAccessToken, checkRole("admin"),

adminRouter.get("/information", AdminController.getAllInformation)
  .get("/information/:id", AdminController.getInformationById)
  .post("/information", AdminController.createInformation)
  .put("/information/:id", AdminController.updateInformation)
  .delete("/information/:id", AdminController.deleteInformation)
  .get("/product", AdminController.getAllProducts)
  .get("/product/:id", AdminController.getProductById)
  .put("/product/:id", AdminController.updateProduct);

module.exports = adminRouter;
