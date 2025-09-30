const { News, Product, TgOrder, TgUser, Vacancy, MainContact } = require("../db/models");

class AdminService {
  static async getAllNews() {
    return await News.findAll();
  }

  static async getNewsById(id) {
    return await News.findByPk(id);
  }

  static async createNews(information) {
    return await News.create(information);
  }

  static async updateNews(id, news) {
    const { title, description, img, is_active } = news;
    const newsToUpdate = await News.findByPk(id);

    if (title) {
      newsToUpdate.title = title;
    }
    if (description) {
      newsToUpdate.description = description;
    }
    if (img) {
      newsToUpdate.img = img;
    }

    newsToUpdate.is_active = is_active;

    await newsToUpdate.save();
    return newsToUpdate;
  }

  static async deleteNews(id) {
    const deletedNews = await News.findByPk(id);
    await News.destroy({ where: { id } });
    return deletedNews;
  }

  static async getAllProducts() {
    return await Product.findAll();
  }

  static async getProductById(id) {
    return await Product.findByPk(id);
  }

  static async createProduct(product) {
    return await Product.create(product);
  }

  static async updateProduct(id, product) {
    const { name, img } = product;
    const productToUpdate = await Product.findByPk(id);
    if (name) {
      productToUpdate.name = name;
    }
    if (img) {
      productToUpdate.img = img;
    }
    await productToUpdate.save();
    return productToUpdate;
  }

  static async deleteProduct(id) {
    const deletedProduct = await Product.findByPk(id);
    await Product.destroy({ where: { id } });
    return deletedProduct;
  }

  static async getOrdersByDate(date, status = "confirmed") {
    try {
      const targetDate = date ? new Date(date) : new Date();

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const whereCondition = {
        createdAt: {
          [require("sequelize").Op.between]: [startOfDay, endOfDay],
        },
      };

      if (status && status !== "all") {
        whereCondition.status = status;
      }

      const orders = await TgOrder.findAll({
        where: whereCondition,
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "variants", "variant_names"],
          },
          {
            model: TgUser,
            as: "tgUser",
            attributes: [
              "tg_user_id",
              "first_name",
              "last_name",
              "tg_username",
            ],
          },
        ],
        attributes: [
          "id",
          "tg_user_id",
          "product_id",
          "quantity",
          "variant",
          "status",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
      });

      return orders;
    } catch (error) {
      console.error("Error in AdminService.getOrdersByDate:", error);
      throw error;
    }
  }

  static async getAllVacancies() {
    return await Vacancy.findAll();
  }

  static async getVacancyById(id) {
    return await Vacancy.findByPk(id);
  }

  static async createVacancy(vacancy) {
    return await Vacancy.create(vacancy);
  }
  static async updateVacancy(id, vacancy) {
    const { position, location, salary, description, is_active } = vacancy;
    const vacancyToUpdate = await Vacancy.findByPk(id);
    if (position) {
      vacancyToUpdate.position = position;
    }
    if (location) {
      vacancyToUpdate.location = location;
    }
    if (salary) {
      vacancyToUpdate.salary = salary;
    }
    if (description) {
      vacancyToUpdate.description = description;
    }
    vacancyToUpdate.is_active = is_active;
    await vacancyToUpdate.save();
    return vacancyToUpdate;
  }
  static async deleteVacancy(id) {
    const deletedVacancy = await Vacancy.findByPk(id);
    await Vacancy.destroy({ where: { id } });
    return deletedVacancy;
  }

  static async getMainContact() {
    return await MainContact.findAll();
  }
  static async updateMainContact(id, contact) {
    const { name, email, phone, telegram, address } = contact;
    const contactToUpdate = await MainContact.findByPk(id);
    if (name) {
      contactToUpdate.name = name;
    }
    if (email) {
      contactToUpdate.email = email;
    }
    if (phone) {
      contactToUpdate.phone = phone;
    }
    if (telegram) {
      contactToUpdate.telegram = telegram;
    }
    if (address) {
      contactToUpdate.address = address;
    }
    await contactToUpdate.save();
    return contactToUpdate;
  }
}

module.exports = AdminService;
