const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

class OverseerDrugController {
  constructor(drugService) {
    this.drugService = drugService;
  }

  async getDrugById(req, res) {
    try {
      const { drugId } = req.params;
      const drug = await this.drugService.getDrugById(drugId);
      res.json(drug);
    } catch (err) {
      console.error(err);
      res.status(404).json({ message: err.message || 'دارو یافت نشد' });
    }
  }

  async createDrug(req, res) {
    try {
      const {
        name,
        code,
        max_dosage,
        side_effects,
        benefits,
        usage,
        allergy,
        interactions,
        description,
        prescription_required,
        type,
        requested_by
      } = req.body;
      const drug = await this.drugService.createDrug({
        name,
        code,
        max_dosage,
        side_effects,
        benefits,
        usage,
        allergy,
        interactions,
        description,
        prescription_required,
        type,
        requested_by
      });
      res.status(201).json(drug);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  async updateDrug(req, res) {
    try {
      const { drugId } = req.params;
      const drug = await this.drugService.updateDrug(drugId, req.body);
      res.json(drug);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  async toggleDrugStatus(req, res) {
    try {
      const { drugId } = req.params;
      const { status } = req.body;
      const drug = await this.drugService.toggleDrugStatus(drugId, status);
      res.json(drug);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }
  async overseerDrugPanelHandler(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 10; // تعداد آیتم‌ها در هر صفحه

      // دریافت داده‌های واقعی از سرویس
      const totalDrugs = await this.drugService.getTotalDrugs();
      const totalPages = Math.ceil(totalDrugs / itemsPerPage);
      const drugs = await this.drugService.getAllDrugsPaginated(page, itemsPerPage);

      res.render('overseer/drugs', {
        drugs,
        currentPage: page,
        totalPages,
        totalDrugs,
        itemsPerPage,
      });
    } catch (error) {
      console.error('Error rendering drugs page:', error);
      res.status(500).send('خطا در بارگذاری داروها');
    }
  }
  async uploadDrugFromExcel(req, res) {
    try {
      // چک کن که فایل آپلود شده باشه
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'فایل اکسل الزامی است' });
      }

      // خواندن فایل آپلودشده
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      // اعتبارسنجی داده‌ها
      if (!jsonData || jsonData.length === 0) {
        return res.status(400).json({ success: false, message: 'داده‌های اکسل معتبر نیست' });
      }

      const drugs = jsonData.map(data => ({
        name: data['نام دارو'],
        code: data['کد دارو'],
        max_dosage: data['مقدار مصرف مجاز'],
        side_effects: data['عوارض'],
        benefits: data['فواید'],
        usage: data['موارد مصرف'],
        allergy: data['حساسیت'],
        interactions: data['تداخل‌ها'],
        description: data['توضیحات'],
        prescription_required: data['نیاز به نسخه'] === 'بله' || data['نیاز به نسخه'] === true,
        type: data['نوع'],
      }));

      // ارسال به سرویس برای ذخیره
      const savedDrugs = await this.drugService.bulkCreateDrugs(drugs);
      res.json({ success: true, message: `${savedDrugs.length} دارو با موفقیت ثبت شد`, data: savedDrugs });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = OverseerDrugController;