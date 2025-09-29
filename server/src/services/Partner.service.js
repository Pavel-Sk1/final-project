const { Partner } = require("../db/models");

class PartnerService {
    static async getAllPartners() {
        return await Partner.findAll();
    }
    static async getPartnerById(id) {
        return await Partner.findByPk(id);
    }
    static async createPartner(partner) {
        return await Partner.create(partner);
    }
    static async updatePartner(id, partner) {
        const { company_name, inn, ogrn, address, contact_person, contact_email, contact_phone, comment, status } = partner;
        const partnerToUpdate = await Partner.findByPk(id);
        if (company_name) {
            partnerToUpdate.company_name = company_name;
        }
        if (inn) {
            partnerToUpdate.inn = inn;
        }
        if (ogrn) {
            partnerToUpdate.ogrn = ogrn;
        }
        if (address) {
            partnerToUpdate.address = address;
        }
        if (contact_person) {
            partnerToUpdate.contact_person = contact_person;
        }
        if (contact_email) {
            partnerToUpdate.contact_email = contact_email;
        }
        if (contact_phone) {
            partnerToUpdate.contact_phone = contact_phone;
        }
        if (comment) {
            partnerToUpdate.comment = comment;
        }
        if (status) {
            partnerToUpdate.status = status;
        }
        await partnerToUpdate.save();
        return partnerToUpdate;
    }
    static async deletePartner(id) {
        const deletedPartner = await Partner.findByPk(id);
        await Partner.destroy({ where: { id } });
        return deletedPartner;
    }
}

module.exports = PartnerService;