class OverseerService {
    constructor({ DrugModel, ClinicModel, DoctorModel, PrescriptionModel, AppointmentModel, ReviewModel, UserModel }) {
      this.DrugModel = DrugModel;
      this.ClinicModel = ClinicModel;
      this.DoctorModel = DoctorModel;
      this.PrescriptionModel = PrescriptionModel;
      this.AppointmentModel = AppointmentModel;
      this.ReviewModel = ReviewModel;
      this.UserModel = UserModel;
    }
  
    // تعداد داروهای تأییدشده
    async getApprovedDrugsCount() {
      return this.DrugModel.countDocuments({ approved: true });
    }
  
    // درمانگاه‌ها با تعداد پزشکان و تعداد نسخه‌ها
    async getClinics() {
      // برای هر درمانگاه تعداد پزشکان و تعداد نسخه‌ها را محاسبه می‌کنیم
  
      // ۱. درمانگاه‌ها را می‌گیریم
      const clinics = await this.ClinicModel.find().lean();
  
      // ۲. تعداد پزشکان هر درمانگاه:
      // پزشکان به user_id متصلند، ولی درمانگاه را ندارند
      // اما نوبت‌ها (appointments) به درمانگاه مرتبط هستند، بنابراین تعداد پزشکان فعال در درمانگاه را بر اساس نوبت‌ها حساب می‌کنیم.
  
      // تعداد نسخه‌ها بر اساس نوبت‌ها و prescriptions
  
      // ابتدا لیست درمانگاه‌ها را با تعداد پزشکان و نسخه‌ها می‌سازیم
  
      const clinicIds = clinics.map(c => c._id);
  
      // تعداد پزشکان در هر درمانگاه بر اساس نوبت‌ها:
      // aggregate روی appointments: group by clinic_id و doctor_id شمارش یکتا پزشکان
  
      const doctorsCountByClinic = await this.AppointmentModel.aggregate([
        { $match: { clinic_id: { $in: clinicIds } } },
        { $group: { _id: { clinic_id: "$clinic_id", doctor_id: "$doctor_id" } } },
        { $group: { _id: "$_id.clinic_id", doctorCount: { $sum: 1 } } }
      ]);
  
      // تعداد نسخه‌ها بر اساس نوبت‌ها و نسخه‌ها:
      // join prescriptions روی appointment_id و group by clinic_id
  
      const prescriptionsCountByClinic = await this.PrescriptionModel.aggregate([
        {
          $lookup: {
            from: 'appointments',
            localField: 'appointment_id',
            foreignField: '_id',
            as: 'appointment'
          }
        },
        { $unwind: "$appointment" },
        { $match: { "appointment.clinic_id": { $in: clinicIds } } },
        {
          $group: {
            _id: "$appointment.clinic_id",
            prescriptionsCount: { $sum: 1 }
          }
        }
      ]);
  
      // تبدیل خروجی aggregation به map برای دسترسی راحت‌تر
      const doctorsCountMap = {};
      doctorsCountByClinic.forEach(dc => {
        doctorsCountMap[dc._id.toString()] = dc.doctorCount;
      });
  
      const prescriptionsCountMap = {};
      prescriptionsCountByClinic.forEach(pc => {
        prescriptionsCountMap[pc._id.toString()] = pc.prescriptionsCount;
      });
  
      return clinics.map(clinic => ({
        id: clinic._id,
        name: clinic.name,
        doctorCount: doctorsCountMap[clinic._id.toString()] || 0,
        prescriptionsCount: prescriptionsCountMap[clinic._id.toString()] || 0,
      }));
    }
  
    // تعداد نسخه‌هایی که بازخورد داده شده (review شده)
    async getFeedbackPrescriptionsCount() {
      // تعداد نسخه‌هایی که حداقل یک بازخورد دارند
      const distinctPrescriptionIds = await this.ReviewModel.distinct('appointment_id', { appointment_id: { $exists: true } });
      return distinctPrescriptionIds.length;
    }
  
    // داروهای در انتظار تایید
    async getPendingDrugRequests(limit = 10) {
      const drugs = await this.DrugModel.find({ approved: false }).limit(limit).lean();
  
      // ساخت اطلاعات لازم برای نمایش
      return drugs.map(drug => ({
        id: drug._id,
        name: drug.name,
        statusText: 'در انتظار بررسی',
        requestTimeAgo: this._formatTimeAgo(drug.createdAt || drug._id.getTimestamp()),
        requestedByName: '', // اگر لازم باشد باید با join روی users یا دکتر استخراج شود (فعلاً خالی)
      }));
    }
  
    // نسخه‌های در انتظار بررسی
    async getPendingPrescriptions(limit = 10) {
      // فرض: نسخه‌های مرتبط با نوبت‌هایی که وضعیت pending دارند یا نسخه‌ها دارای فیلد status باشند
      // چون در ERD فیلد status در prescriptions وجود ندارد، ما با وضعیت نوبت‌ها فیلتر می‌کنیم
  
      // ابتدا نوبت‌های pending را می‌گیریم
      const pendingAppointments = await this.AppointmentModel.find({ status: 'pending' }).select('_id doctor_id patient_id').limit(limit).lean();
  
      // برای هر نوبت نسخه‌های مرتبط را می‌گیریم
      const appointmentIds = pendingAppointments.map(ap => ap._id);
  
      const prescriptions = await this.PrescriptionModel.find({ appointment_id: { $in: appointmentIds } }).lean();
  
      // آماده سازی خروجی همراه با نام پزشک و بیمار (با join دستی)
      const doctorIds = pendingAppointments.map(a => a.doctor_id);
      const patientIds = pendingAppointments.map(a => a.patient_id);
  
      // گرفتن نام پزشکان و بیماران (از جدول users یا doctors/patients)
      const doctorsUsers = await this.DoctorModel.find({ _id: { $in: doctorIds } }).populate('user_id', 'name').lean();
      const patientsUsers = await this.UserModel.find({ _id: { $in: patientIds } }).lean();
  
      // ساخت map برای دسترسی سریع
      const doctorNameMap = {};
      doctorsUsers.forEach(d => {
        if (d.user_id) doctorNameMap[d._id.toString()] = d.user_id.name;
      });
      const patientNameMap = {};
      patientsUsers.forEach(p => {
        patientNameMap[p._id.toString()] = p.name;
      });
  
      // حالا خروجی را می‌سازیم
      return prescriptions.map(presc => {
        const appointment = pendingAppointments.find(ap => ap._id.toString() === presc.appointment_id.toString());
        const doctorName = appointment ? doctorNameMap[appointment.doctor_id.toString()] || 'نامشخص' : 'نامشخص';
        const patientName = appointment ? patientNameMap[appointment.patient_id.toString()] || 'نامشخص' : 'نامشخص';
  
        return {
          id: presc._id,
          number: presc._id.toString(),
          doctorName,
          patientName,
          sentTimeAgo: this._formatTimeAgo(presc.createdAt || presc._id.getTimestamp()),
        };
      });
    }
  
    _formatTimeAgo(date) {
      if (!date) return '';
      const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
      if (seconds < 60) return `${seconds} ثانیه قبل`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} دقیقه قبل`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} ساعت قبل`;
      const days = Math.floor(hours / 24);
      return `${days} روز قبل`;
    }
  }
  
  module.exports = OverseerService;
  