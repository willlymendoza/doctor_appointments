const moment = require("moment");

const postDateFormat = (date) => {
  return moment(moment(date).utc().format("yyyy-MM-DD"));
};

const ymdDateFromFormat = (date) => {
  return moment(date).set({ hour: 0, second: 0, minute: 0 }).format();
};

const ymdDateToFormat = (date) => {
  return moment(date).set({ hour: 23, second: 59, minute: 59 }).format();
};

module.exports.postDateFormat = postDateFormat;
module.exports.ymdDateFromFormat = ymdDateFromFormat;
module.exports.ymdDateToFormat = ymdDateToFormat;
