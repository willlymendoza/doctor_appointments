const moment = require("moment");

const postDateFormat = (date = "") => {
  return moment(date).format();
};

const ymdDateFormat = (date = "") => {
  return moment(date).format("yyyy-MM-DD");
};

module.exports.postDateFormat = postDateFormat;
module.exports.ymdDateFormat = ymdDateFormat;
