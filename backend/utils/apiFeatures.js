class APIFeatures {
    /**
     * @param {mongoose.Query} query - کوئری اولیه Mongoose (مثلاً Model.find())
     * @param {Object} queryString - پارامترهای URL (مثلاً req.query)
     */
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    /**
     * فیلتر کردن نتایج بر اساس پارامترهای موجود در query
     */
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // پشتیبانی از فیلترهای پیشرفته (gt, gte, lt, lte, in, nin)
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|nin)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    /**
     * جستجوی متنی ساده در فیلد خاص
     * @param {string[]} fields - آرایه‌ای از فیلدهایی که باید جستجو در آنها انجام شود
     */
    search(fields = []) {
      if (this.queryString.search && fields.length > 0) {
        const keyword = this.queryString.search.trim();
        this.query = this.query.find({
          $or: fields.map(field => ({
            [field]: { $regex: keyword, $options: 'i' }
          }))
        });
      }
      return this;
    }
  
    /**
     * مرتب‌سازی نتایج (مثلاً ?sort=createdAt,-name)
     */
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt'); // پیش‌فرض: مرتب‌سازی بر اساس زمان ساخت
      }
      return this;
    }
  
    /**
     * محدود کردن فیلدهای خروجی (مثلاً ?fields=name,price)
     */
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v'); // مخفی کردن فیلد __v پیش‌فرض
      }
      return this;
    }
  
    /**
     * صفحه‌بندی نتایج (مثلاً ?page=2&limit=20)
     */
    paginate() {
      const page = parseInt(this.queryString.page, 10) || 1;
      const limit = parseInt(this.queryString.limit, 10) || 10;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }
  
  module.exports = APIFeatures;
  