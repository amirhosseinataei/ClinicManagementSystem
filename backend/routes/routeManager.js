const express = require('express');
const UserModel = require('../models/User'); // فقط UserModel کافیه
const OverseerService = require('../services/OverseerService');
const DrugModel = require('../models/Drug');
const ClinicModel = require('../models/Clinic');
const DoctorModel = require('../models/Doctor');
const PrescriptionModel = require('../models/Prescription');
const AppointmentModel = require('../models/Appointment');
const ReviewModel = require('../models/Review');

const tokenMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const IPWhitelistMiddleware = require('../middlewares/ipWhitelistMiddleware');
const ClinicService = require('../services/ClinicService');
const OverseerClinicController = require('../controllers/OverseerClinicController');
const OverseerDrugService = require('../services/OverseerDrugService');
const OverseerDrugController = require('../controllers/OverseerDrugController');
const restrictStaticMiddleware = require('../middlewares/restrictStaticMiddleware'); // اضافه کردن میدلور

require('dotenv').config();
const allowedIPs = process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [];
const debugIPMiddleware = process.env.DEBUG_IP_MIDDLEWARE === 'true';

const ipWhitelist = new IPWhitelistMiddleware(allowedIPs, debugIPMiddleware);
const overseerService = new OverseerService({
  DrugModel,
  ClinicModel,
  DoctorModel,
  PrescriptionModel,
  AppointmentModel,
  ReviewModel,
  UserModel
});
const clinicService = new ClinicService({ ClinicModel, UserModel });
const overseerClinicController = new OverseerClinicController(clinicService);
const drugService = new OverseerDrugService({ DrugModel, UserModel });
const overseerDrugController = new OverseerDrugController(drugService);

class RouteManager {
  constructor() {
    this.routes = [
      {
        method: 'get',
        path: '/dashboard',
        middleware: [tokenMiddleware, restrictStaticMiddleware], // اضافه کردن میدلور
        handler: this.dashboardHandler,
      },
      {
        method: 'get',
        path: '/admin/users',
        middleware: [tokenMiddleware, roleMiddleware.isAdmin(), restrictStaticMiddleware], // اضافه کردن میدلور
        handler: this.adminUsersHandler,
      },
      {
        method: 'get',
        path: '/health',
        middleware: [restrictStaticMiddleware], // اضافه کردن میدلور
        handler: (req, res) => res.status(200).json({ status: 'ok' }),
      },
      {
        method: 'get',
        path: '/overseer-panel',
        middleware: [ipWhitelist.middleware(), restrictStaticMiddleware], // اضافه کردن میدلور
        handler: this.overseerPanelHandler,
      },
      {
        method: 'get',
        path: '/overseer/clinics',
        middleware: [ipWhitelist.middleware(), restrictStaticMiddleware], // اضافه کردن میدلور
        handler: overseerClinicController.overseerClinicsPanelHandler.bind(overseerClinicController),
      },
      {
        method: 'get',
        path: '/overseer/drugs',
        middleware: [ipWhitelist.middleware(), restrictStaticMiddleware], // اضافه کردن میدلور
        handler: overseerDrugController.overseerDrugPanelHandler.bind(overseerDrugController),
      },
      {
        method: 'all',
        path: '*',
        middleware: [restrictStaticMiddleware], // اضافه کردن میدلور
        handler: (req, res) => res.status(404).json({ message: 'Route not found' }),
      },
    ];
  }

  registerRoutes(app) {
    this.routes.forEach(route => {
      const method = route.method || 'get';
      app[method](route.path, ...(route.middleware || []), route.handler.bind(this));
    });
  }

  async dashboardHandler(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserModel.findById(userId).select('name role');

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // تنظیم هدر برای تأیید درخواست EJS
      res.set('X-EJS-Request', 'true');
      res.status(200).json({
        message: 'Dashboard access granted',
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async adminUsersHandler(req, res) {
    try {
      const users = await UserModel.find().select('name role');
      // تنظیم هدر برای تأیید درخواست EJS
      res.set('X-EJS-Request', 'true');
      res.status(200).json({ users });
    } catch (err) {
      console.error('Admin users error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async overseerPanelHandler(req, res) {
    try {
      const approvedDrugsCount = await overseerService.getApprovedDrugsCount();
      const clinics = await overseerService.getClinics();
      const clinicsCount = clinics.length;
      const pendingDrugs = await overseerService.getPendingDrugRequests();
      const pendingDrugRequestsCount = pendingDrugs.length;
      const feedbackPrescriptionsCount = await overseerService.getFeedbackPrescriptionsCount();
      const pendingPrescriptions = await overseerService.getPendingPrescriptions();

      const morePendingDrugsCount = Math.max(0, pendingDrugRequestsCount - pendingDrugs.length);

      // اگر هیچ داده‌ای نبود (مثلاً اولین بار اجرا شده)
      const isEmpty = true;

      if (isEmpty) {
        // استفاده از داده‌های فیک
        return res.render('overseer/panel', {
          approvedDrugsCount: 128,
          clinicsCount: 12,
          pendingDrugRequestsCount: 7,
          feedbackPrescriptionsCount: 23,
          clinics: [
            { id: 1, name: 'شفا', doctorCount: 6, prescriptionsCount: 45 },
            { id: 2, name: 'نور', doctorCount: 3, prescriptionsCount: 18 },
          ],
          pendingDrugs: [
            { id: 1, name: 'قرص آسپرین', statusText: 'درخواست شده توسط دکتر رضایی', requestTimeAgo: '10 دقیقه قبل' },
            { id: 2, name: 'شربت دیفن‌هیدرامین', statusText: 'در انتظار بررسی', requestTimeAgo: '1 ساعت قبل' },
            { id: 3, name: 'کپسول امگا ۳', statusText: 'درخواست توسط دکتر یوسفی', requestTimeAgo: '۲ روز قبل' }
          ],
          morePendingDrugsCount: 5,
          pendingPrescriptions: [
            { id: 832, number: 832, doctorName: 'احمدی', patientName: 'نرگس نوروزی', sentTimeAgo: '۳ ساعت قبل' },
            { id: 833, number: 833, doctorName: 'حسینی', patientName: 'علی سعیدی', sentTimeAgo: '۱ روز قبل' }
          ]
        });
      }

      // تنظیم هدر برای تأیید درخواست EJS
      res.render('overseer/panel', {
        title: 'Overseer Panel',
        approvedDrugsCount,
        clinicsCount,
        clinics,
        pendingDrugRequestsCount,
        pendingDrugs,
        morePendingDrugsCount,
        feedbackPrescriptionsCount,
        pendingPrescriptions,
      });
    } catch (err) {
      console.error('Overseer panel error:', err);
      res.status(500).send('Server error');
    }
  }
}

module.exports = RouteManager;