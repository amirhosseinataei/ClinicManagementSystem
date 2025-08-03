// routeManager.js
const express = require('express');
const User = require('../models/User'); // مدل کاربر در MongoDB
const tokenMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
require('dotenv').config();

class RouteManager {
  constructor() {
    this.routes = [
      {
        method: 'get',
        path: '/dashboard',
        middleware: [tokenMiddleware],
        handler: this.dashboardHandler,
      },
      {
        method: 'get',
        path: '/admin/users',
        middleware: [tokenMiddleware, roleMiddleware.isAdmin()],
        handler: this.adminUsersHandler,
      },
      {
        method: 'get',
        path: '/health',
        middleware: [],
        handler: (req, res) => res.status(200).json({ status: 'ok' }),
      },
      {
        method: 'all',
        path: '*',
        middleware: [],
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

  /**
   * کنترلر مسیر /dashboard
   * @param {*} req 
   * @param {*} res 
   */
  async dashboardHandler(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('name role');

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

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

  /**
   * کنترلر مسیر /admin/users
   */
  async adminUsersHandler(req, res) {
    try {
      const users = await User.find().select('name role');
      res.status(200).json({ users });
    } catch (err) {
      console.error('Admin users error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = RouteManager;
