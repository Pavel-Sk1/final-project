const router = require('express').Router();
const PartnerController = require('../controllers/Partner.controller');
const checkRole = require('../middleware/checkRole');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router.get('/', PartnerController.getAllPartners);
router.get('/:id', PartnerController.getPartnerById);
router.post('/', verifyAccessToken, checkRole('admin'), PartnerController.createPartner);
router.put('/:id', verifyAccessToken, checkRole('admin'), PartnerController.updatePartner);
router.delete('/:id', verifyAccessToken, checkRole('admin'), PartnerController.deletePartner);
module.exports = router;
