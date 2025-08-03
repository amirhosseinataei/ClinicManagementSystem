/**
 * یک تابع کمکی برای گرفتن خطاهای async بدون نیاز به try/catch در هر کنترلر
 * @param {Function} fn - تابع async که باید هندل شود
 * @returns {Function} middleware Express با handling خطا
 */

const catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  
module.exports = catchAsync;
  