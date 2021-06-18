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

  getTicketbyId(id) {
    return this.data.find((el) => {
      if (el.id === id) return el;
    });
  }

  deleteTicket(id) {
    const el = this.getTicketbyId(id);
    this.data.splice(this.data.indexOf(el), 1);
  }

  getData() {
    return this.data;
  }

  editTicket(id, obj) {
    for (let i = 0; i < this.data.length; i += 1) {
      if (this.data[i].id === id) {
        this.data[i].description = obj.text;
        this.data[i].name = obj.header;
      }
    }
  }

  changeStatus(id) {
    for (let i = 0; i < this.data.length; i += 1) {
      if (this.data[i].id === id) this.data[i].status = !this.data[i].status;
    }
  }
};
