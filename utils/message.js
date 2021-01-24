const moment = require("moment");

const generateMessage = (from, text , initials) => {
  return {
    from: from,
    text: text,
    createdAt: moment().valueOf(),
    initials
  };
};
const generateLocationMessage = (from, lat, lon) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lon}`,
    createdAt: moment().valueOf()
  };
};

module.exports = { generateMessage, generateLocationMessage };


