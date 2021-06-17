const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const cors = require('@koa/cors')

function createTicket(obj) {
  if (obj.header.length <= 0) {
    return;
  }
  const id = uuidv4();
  const time = `${moment().format('L')} ${moment().format('LT')}`
  if (obj.text.length <= 0) {
      return {
          id: id,
          status: false,
          created: time,
          name: obj.header
      }
  }
  if (obj.text.length > 0) {
      return {
          id: id,
          status: false,
          created: time,
          name: obj.header,
          description: obj.text,
      }
  }
}

const app = new Koa();
const data = []

app.use(
  koaBody({
    urlencoded: true,
  })
);

app.use(cors());

app.use(async (ctx, next) => {
  const origin = ctx.request.get("Origin");
  if (!origin) {
    return await next();
  }
  
  const headers = { "Access-Control-Allow-Origin": "*" };

  if (ctx.request.method !== "OPTIONS") {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      console.log(e)
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  console.log(1)
  if (ctx.request.get("Access-Control-Request-Method")) {
    ctx.response.set({
      ...headers,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
    });
    if (ctx.request.get("Access-Control-Request-Headers")) {
      ctx.response.set(
        "Access-Control-Allow-Headers",
        ctx.request.get("Access-Control-Allow-Request-Headers")
      );
    }
    ctx.response.status = 204; // No content
  }
});

app.use(async(ctx, next)  => {
  console.log(ctx.request.querystring)
  const { method } = ctx.request.query;
  switch(method) {
    case 'allTickets':
      ctx.response.body = data;
      ctx.response.status = 200;
      return;
    case `ticketById&id`:
      const { id } = ctx.request.querystring
      ctx.response.status = 200;
      ctx.response.dody = data.filter((el) => {
        if (el.id === id) return el;
      });
      return;
    case 'createTicket':
      data.push(createTicket(ctx.request.body));
      ctx.response.status = 200;
      ctx.response.body = 'succes';
      return;
    case 'deleteTicket':
      const el = data.filter((el) => {if (el.id === ctx.request.body.id) return el});
      data.splice(el, 1)
      ctx.response.status = 200;
      ctx.response.body = 'succes';
      return;
    case 'changeTicket':
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].id === ctx.request.body.id) {
          console.log(data[i].id)
          data[i].status = !data[i].status;
        }
      }
    case 'ticketById':
      const ticket = data.filter((el) => {
        if (el.id === ctx.request.query.id) return el;
      });
      ctx.response.body = ticket;
      ctx.response.status = 200;
      return;
    case 'changeTicketData':
      console.log(ctx.request.body)
      const b = data.filter((el) => {
        if (el.id === ctx.request.body.id) {
          return el;
        }
      });
      const a = b[0];
      data.splice(a, 1);
      a.name = ctx.request.body.header;
      a.description = ctx.request.body.text;
      data.push(a);
      ctx.response.status = 200;
      return;
    default:
      ctx.response.status = 404;
      return;
  }
})

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port)
