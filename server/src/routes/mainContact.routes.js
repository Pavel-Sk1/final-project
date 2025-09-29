const router = require("express").Router();
const MainContactController = require("../controllers/MainContact.controller");

router.get("/", MainContactController.getMainContact);

module.exports = router;