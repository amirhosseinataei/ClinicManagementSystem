class ClinicService {
    constructor({ ClinicModel, UserModel }) {
      this.Clinic = ClinicModel;
      this.User = UserModel;
    }
  
    async getTotalClinics() {
      return this.Clinic.countDocuments();
    }
  
    async getAllClinicsPaginated(page, itemsPerPage) {
      const skip = (page - 1) * itemsPerPage;
      return this.Clinic.find()
        .populate('supervisor_id', 'name phone national_code')
        .skip(skip)
        .limit(itemsPerPage);
    }
  
    async createClinicWithSupervisor({ name, address, license_number, supervisor }) {
      const existingUser = await this.User.findOne({ national_code: supervisor.national_code });
      if (existingUser) {
        throw new Error('Supervisor with this national code already exists');
      }
  
      const newUser = await this.User.create({
        name: supervisor.name,
        phone: supervisor.phone,
        national_code: supervisor.national_code,
        role: 'supervisor',
        is_phone_verified: false,
      });
  
      const clinic = await this.Clinic.create({
        name,
        address,
        license_number,
        supervisor_id: newUser._id,
      });
  
      return clinic;
    }
  
    async getClinicById(clinicId) {
      const clinic = await this.Clinic.findById(clinicId).populate('supervisor_id', 'name phone national_code');
      if (!clinic) throw new Error('Clinic not found');
      return clinic;
    }
  
    async updateClinic(clinicId, data) {
      const session = await this.Clinic.startSession();
      session.startTransaction();

      try {
        const clinic = await this.Clinic.findById(clinicId).session(session);
        if (!clinic) throw new Error('Clinic not found');

        const { name, address, license_number, supervisor } = data;

        // Update clinic fields
        clinic.name = name || clinic.name;
        clinic.address = address || clinic.address;
        clinic.license_number = license_number || clinic.license_number;

        // Update supervisor if provided
        if (supervisor) {
          const supervisorData = await this.User.findById(clinic.supervisor_id).session(session);
          if (!supervisorData) throw new Error('Supervisor not found');

          supervisorData.name = supervisor.name || supervisorData.name;
          supervisorData.phone = supervisor.phone || supervisorData.phone;
          supervisorData.national_code = supervisor.national_code || supervisorData.national_code;

          await supervisorData.save({ session });
        }

        await clinic.save({ session });
        await session.commitTransaction();
        return this.getClinicById(clinicId); // Return populated clinic
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    }
  
    async deactivateClinic(clinicId) {
      const clinic = await this.Clinic.findById(clinicId);
      if (!clinic) throw new Error('Clinic not found');
  
      clinic.active = !clinic.active;
      await clinic.save();
      return clinic;
    }
  
    async getAllClinics() {
      return this.Clinic.find().populate('supervisor_id', 'name phone national_code');
    }
}
  
module.exports = ClinicService;