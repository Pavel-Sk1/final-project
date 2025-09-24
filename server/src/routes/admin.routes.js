const adminRouter = require("express").Router();
const AdminController = require("../controllers/Admin.controller");

adminRouter
  .post("/information", AdminController.createInformation)
  .put("/information/:id", AdminController.updateInformation)
  .delete("/information/:id", AdminController.deleteInformation)
  .put("/product/:id", AdminController.updateProduct);

module.exports = adminRouter;
