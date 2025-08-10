//OverseerClinicController.js
class OverseerClinicController {
    constructor(clinicService) {
      this.clinicService = clinicService;
    }
  
    async getAllClinics(req, res) {
      try {
        const clinics = await this.clinicService.getAllClinics();
        res.json(clinics);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'خطای سرور' });
      }
    }
    async getClinicById(req, res) {
        try {
          const { clinicId } = req.params;
          const clinic = await this.clinicService.getClinicById(clinicId);
          res.json(clinic);
        } catch (err) {
          console.error(err);
          res.status(404).json({ message: err.message || 'درمانگاه یافت نشد' });
        }
      }
    async createClinic(req, res) {
      try {
        const { name, address, license_number, supervisor } = req.body;
        const clinic = await this.clinicService.createClinicWithSupervisor({
          name,
          address,
          license_number,
          supervisor,
        });
        res.status(201).json(clinic);
      } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
      }
    }
    async overseerClinicsPanelHandler(req, res) {
        try {
          const page = parseInt(req.query.page) || 1;
          const itemsPerPage = 1;
          const isEmpty = (await this.clinicService.getTotalClinics()) === 0;
    
          let clinics, totalClinics, totalPages;
    
          if (isEmpty) {
            const fakeClinics = [
              { _id: '64e3001d9a3f6b0012345678', name: 'درمانگاه شفا', license_number: '123456', address: 'تهران، خیابان انقلاب، پلاک 45', is_active: true, supervisor: { name: 'محمد رضایی', national_code: '0012345678', phone: '09121234567' } },
              { _id: '64e3001d9a3f6b0012345679', name: 'درمانگاه نور', license_number: '987654', address: 'اصفهان، خیابان چهارباغ، پلاک 12', is_active: false, supervisor: { name: 'سارا یوسفی', national_code: '0098765432', phone: '09129876543' } },
              { _id: '64e3001d9a3f6b0012345680', name: 'درمانگاه امید', license_number: '456789', address: 'مشهد، بلوار فردوسی، پلاک 3', is_active: true, supervisor: { name: 'علی احمدی', national_code: '0045678901', phone: '09123456789' } },
            ];
            totalClinics = fakeClinics.length;
            totalPages = Math.ceil(totalClinics / itemsPerPage);
            clinics = fakeClinics.slice((page - 1) * itemsPerPage, page * itemsPerPage);
          } else {
            totalClinics = await this.clinicService.getTotalClinics();
            totalPages = Math.ceil(totalClinics / itemsPerPage);
            const clinicsRaw = await this.clinicService.getAllClinicsPaginated(page, itemsPerPage);
            clinics = clinicsRaw.map(clinic => ({
              _id: clinic._id,
              name: clinic.name,
              license_number: clinic.license_number,
              address: clinic.address,
              is_active: clinic.active !== undefined ? clinic.active : true,
              supervisor: clinic.supervisor_id ? {
                name: clinic.supervisor_id.name,
                national_code: clinic.supervisor_id.national_code,
                phone: clinic.supervisor_id.phone
              } : null
            }));
          }
          res.render('overseer/clinics', {
            clinics,
            currentPage: page,
            totalPages,
            totalClinics,
            itemsPerPage,
          });
        } catch (error) {
          console.error('Error rendering clinics page:', error);
          res.status(500).send('خطا در بارگذاری درمانگاه‌ها');
        }
      }
    async updateClinic(req, res) {
      try {
        const { clinicId } = req.params;
        const clinic = await this.clinicService.updateClinic(clinicId, req.body);
        res.json(clinic);
      } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
      }
    }
  
    async deactivateClinic(req, res) {
      try {        
        const { clinicId } = req.params;
        const clinic = await this.clinicService.deactivateClinic(clinicId);
        res.json(clinic);
      } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
      }
    }
  }
  
  module.exports = OverseerClinicController;
  