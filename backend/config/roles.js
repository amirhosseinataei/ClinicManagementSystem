// src/config/roles.js

const dotenv = require('dotenv');
dotenv.config();

class RoleManager {
  constructor() {
    this.roles = {
      PATIENT: process.env.ROLE_PATIENT,
      DOCTOR: process.env.ROLE_DOCTOR,
      OVERSEER: process.env.ROLE_OVERSEER,
      CLINIC_MANAGER: process.env.ROLE_CLINIC_MANAGER,
      PHARMACY_MANAGER: process.env.ROLE_PHARMACY_MANAGER,
      LAB_MANAGER: process.env.ROLE_LAB_MANAGER,
      REVIEW_MANAGER: process.env.ROLE_REVIEW_MANAGER,
      ADMIN: process.env.ROLE_ADMIN,
    };
  }

  /**
   * دریافت لیست کامل نقش‌ها
   */
  getAllRoles() {
    return Object.values(this.roles);
  }

  /**
   * بررسی اینکه نقش موجود است یا نه
   */
  isValidRole(role) {
    return this.getAllRoles().includes(role);
  }

  /**
   * دسترسی مستقیم به نقش‌ها
   */
  get PATIENT() {
    return this.roles.PATIENT;
  }

  get DOCTOR() {
    return this.roles.DOCTOR;
  }

  get OVERSEER() {
    return this.roles.OVERSEER;
  }

  get CLINIC_MANAGER() {
    return this.roles.CLINIC_MANAGER;
  }

  get PHARMACY_MANAGER() {
    return this.roles.PHARMACY_MANAGER;
  }

  get LAB_MANAGER() {
    return this.roles.LAB_MANAGER;
  }

  get REVIEW_MANAGER() {
    return this.roles.REVIEW_MANAGER;
  }

  get ADMIN() {
    return this.roles.ADMIN;
  }
}

module.exports = new RoleManager();
