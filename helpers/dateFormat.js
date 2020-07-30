const moment = require("moment");

const ymdDateFormat = (date) => {
  return moment(date).format("yyyy-DD-MM");
};

const ymdDateFromFormat = (date) => {
  return moment(date).set({ hour: 0, second: 0, minute: 0 }).format();
};

const ymdDateToFormat = (date) => {
  return moment(date).set({ hour: 23, second: 59, minute: 59 }).format();
};

module.exports.ymdDateFormat = ymdDateFormat;
module.exports.ymdDateFromFormat = ymdDateFromFormat;
module.exports.ymdDateToFormat = ymdDateToFormat;
