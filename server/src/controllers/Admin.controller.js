const AdminService = require("../services/Admin.service");
const formatResponse = require("../utils/formatResponse");

class AdminController {
  static async getAllInformation(req, res) {
    try {
      const information = await AdminService.getAllInformation();
      res.status(200).json(formatResponse(200, "Information fetched successfully", information));
    } catch (error) {
      console.error("======AdminController.getAllInformation===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }

  static async getInformationById(req, res) {
    try {
      const { id } = req.params;
      const information = await AdminService.getInformationById(id);
      res.status(200).json(formatResponse(200, "Information fetched successfully", information));
    } catch (error) {
      console.error("======AdminController.getInformationById===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }

  static async createInformation(req, res) {
    try {
      const { title, description, img } = req.body;
      const information = await AdminService.createInformation({
        title,
        description,
        img,
      });
      if (!information) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Information not created",
              null,
              "Information not created"
            )
          );
      }
      res
        .status(200)
        .json(
          formatResponse(200, "Information created successfully", information)
        );
    } catch (error) {
      console.error("======AdminController.createInformation===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }

  static async updateInformation(req, res) {
    try {
      const { id } = req.params;
      const { title, description, img } = req.body;
      const information = await AdminService.updateInformation(id, {
        title,
        description,
        img,
      });
      res
        .status(200)
        .json(
          formatResponse(200, "Information updated successfully", information)
        );
    } catch (error) {
      console.error("======AdminController.updateInformation===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }

  static async deleteInformation(req, res) {
    try {
      const { id } = req.params;
      const information = await AdminService.deleteInformation(id);
      res
        .status(200)
        .json(
          formatResponse(200, "Information deleted successfully", information)
        );
    } catch (error) {
      console.error("======AdminController.deleteInformation===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }
  static async getAllProducts(req, res) {
    try {
      const products = await AdminService.getAllProducts();
      res.status(200).json(formatResponse(200, "Products fetched successfully", products));
    } catch (error) {
      console.error("======AdminController.getAllProducts===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await AdminService.getProductById(id);
      res.status(200).json(formatResponse(200, "Product fetched successfully", product));
    } catch (error) {
      console.error("======AdminController.getProductById===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, img } = req.body;
      const product = await AdminService.updateProduct(id, { name, img });
      res
        .status(200)
        .json(formatResponse(200, "Product updated successfully", product));
    } catch (error) {
      console.error("======AdminController.updateProduct===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }  
}

module.exports = AdminController;
