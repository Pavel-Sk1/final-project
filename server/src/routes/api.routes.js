const router = require("express").Router();
const formatResponse = require("../utils/formatResponse");
const authRoutes = require("./auth.routes");
const adminRouter = require("./admin.routes");
const newsRoutes = require("./news.routes");
const productsRoutes = require("./products.routes");
const infoRoutes = require("./info.routes");
const categoriesRoutes = require("./categories.routes");
const vacancyRoutes = require("./vacancy.routes");
const mainContactRoutes = require("./mainContact.routes");
const partnerRoutes = require("./partner.routes");
const ordersRoutes = require("./orders.routes");

router.use("/auth", authRoutes);
router.use("/admin", adminRouter);
router.use("/news", newsRoutes);
router.use("/products", productsRoutes);
router.use("/info", infoRoutes);
router.use("/categories", categoriesRoutes);
router.use("/vacancy", vacancyRoutes);
router.use("/contact", mainContactRoutes);
router.use("/partners", partnerRoutes);
router.use("/orders", ordersRoutes);

router.use((req, res) => {
  res
    .status(404)
    .json(formatResponse(404, "Маршрут не найден", null, "Маршрут не найден"));
});

module.exports = router;
