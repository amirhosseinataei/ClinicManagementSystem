const express = require('express');
const router = express.Router();

const ClinicModel = require('../models/Clinic');
const UserModel = require('../models/User');

const ClinicService = require('../services/ClinicService');
const OverseerClinicController = require('../controllers/OverseerClinicController');
const IPWhitelistMiddleware = require('../middlewares/ipWhitelistMiddleware');

require('dotenv').config();
const allowedIPs = process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [];
const debugIPMiddleware = process.env.DEBUG_IP_MIDDLEWARE === 'true';
const ipWhitelist = new IPWhitelistMiddleware(allowedIPs, debugIPMiddleware);

// DI
const clinicService = new ClinicService({ ClinicModel, UserModel });
const overseerClinicController = new OverseerClinicController(clinicService);

// مسیرها بدون /overseer
router.get('/clinics/:clinicId', ipWhitelist.middleware(), overseerClinicController.getClinicById.bind(overseerClinicController));
router.post('/clinics', ipWhitelist.middleware(), overseerClinicController.createClinic.bind(overseerClinicController));
router.put('/clinics/:clinicId', ipWhitelist.middleware(), overseerClinicController.updateClinic.bind(overseerClinicController));
router.patch('/clinics/:clinicId/status', ipWhitelist.middleware(), overseerClinicController.deactivateClinic.bind(overseerClinicController));

module.exports = router;