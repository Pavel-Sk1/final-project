const { Information, Product } = require("../db/models");

class AdminService {
    static async createInformation(information) {
        return await Information.create(information);
    }    

    static async updateInformation(id, information) {
        const { title, description, img } = information;
        const informationToUpdate = await Information.findByPk(id);
        
        if (title) {
            informationToUpdate.title = title;
        }
        if (description) {
            informationToUpdate.description = description;
        }
        if (img) {
            informationToUpdate.img = img;
        }
        await informationToUpdate.save();
        return informationToUpdate;
    }

    static async deleteInformation(id) {
        return await Information.destroy({ where: { id } });
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
}

module.exports = AdminService;