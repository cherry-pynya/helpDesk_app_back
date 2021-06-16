const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

module.exports = class Tickets {
  constructor(data = []) {
    this.data = data;
  }

  createTicket(obj) {
    if (obj.header.length <= 0) {
      return;
    }
    const id = uuidv4();
    const time = `${moment().format("L")} ${moment().format("LT")}`;
    if (obj.text.length <= 0) {
        this.data.push({
        id: id,
        status: false,
        created: time,
        name: obj.header,
      });
    }
    if (obj.text.length > 0) {
      this.data.push({
        id: id,
        status: false,
        created: time,
        name: obj.header,
        description: obj.text,
      });
    }
  }
};
