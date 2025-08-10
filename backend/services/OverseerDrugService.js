const mongoose = require('mongoose');

class OverseerDrugService {
  constructor({ DrugModel, UserModel }) {
    this.Drug = DrugModel;
    this.User = UserModel;
  }

  async getTotalDrugs() {
    return this.Drug.countDocuments();
  }

  async getAllDrugsPaginated(page, itemsPerPage) {
    const skip = (page - 1) * itemsPerPage;
    return this.Drug.find()
      .skip(skip)
      .limit(itemsPerPage)
      .lean();
  }

  async createDrug({ name, code, max_dosage, side_effects, benefits, usage, allergy, interactions, description, prescription_required, type }) {
    const existingDrug = await this.Drug.findOne({ code });
    if (existingDrug) {
      throw new Error('Drug with this code already exists');
    }

    const drug = await this.Drug.create({
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
      approved: new Date(),
      status: 'pending'
    });

    return drug;
  }

  async getDrugById(drugId) {
    const drug = await this.Drug.findById(drugId).lean();
    if (!drug) throw new Error('Drug not found');
    return drug;
  }

  async updateDrug(drugId, data) {
    try {
      const drug = await this.Drug.findById(drugId);
      if (!drug) throw new Error('Drug not found');

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
        type
      } = data;

      drug.name = name || drug.name;
      drug.code = code || drug.code;
      drug.max_dosage = max_dosage || drug.max_dosage;
      drug.side_effects = side_effects || drug.side_effects;
      drug.benefits = benefits || drug.benefits;
      drug.usage = usage || drug.usage;
      drug.allergy = allergy || drug.allergy;
      drug.interactions = interactions || drug.interactions;
      drug.description = description || drug.description;
      drug.prescription_required = prescription_required !== undefined ? prescription_required : drug.prescription_required;
      drug.type = type || drug.type;

      await drug.save();
      return this.getDrugById(drugId);
    } catch (err) {
      throw err;
    }
  }

  async toggleDrugStatus(drugId, status) {
    const drug = await this.Drug.findById(drugId);
    if (!drug) throw new Error('Drug not found');

    if (!['active', 'inactive', 'pending'].includes(status)) {
      throw new Error('Invalid status value');
    }

    drug.status = status;
    if (status === 'active') {
      drug.approved = new Date();
    }
    await drug.save();
    return drug;
  }

  async getAllDrugs() {
    return this.Drug.find().lean();
  }

  async approveDrug(drugId, approverId) {
    try {
      const drug = await this.Drug.findById(drugId);
      if (!drug) throw new Error('Drug not found');

      drug.status = 'active';
      drug.approved = new Date();

      await drug.save();
      return this.getDrugById(drugId);
    } catch (err) {
      throw err;
    }
  }

  async deleteDrug(drugId) {
    const drug = await this.Drug.findById(drugId);
    if (!drug) throw new Error('Drug not found');

    await drug.remove();
    return { message: 'Drug deleted successfully' };
  }

  async bulkCreateDrugs(drugs) {
    const savedDrugs = [];
    try {
      for (const drugData of drugs) {
        const { name, code, max_dosage, side_effects, benefits, usage, allergy, interactions, description, prescription_required, type } = drugData;

        const existingDrug = await this.Drug.findOne({ code });
        if (existingDrug) throw new Error(`Drug with code ${code} already exists`);

        const drug = new this.Drug({
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
          approved: new Date(),
          status: 'pending'
        });

        savedDrugs.push(await drug.save());
      }
      return savedDrugs;
    } catch (err) {
      // پاک کردن داده‌های ذخیره‌شده در صورت خطا (اختیاری)
      for (const drug of savedDrugs) {
        await this.Drug.findByIdAndDelete(drug._id).catch(console.error);
      }
      throw err;
    }
  }
}

module.exports = OverseerDrugService;