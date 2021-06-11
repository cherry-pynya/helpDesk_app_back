const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");

const app = new Koa();
const data = [{
  id: 1,
  name: 'Check Engine',
  status: false,
  created: '01.01.2021, 00:00',
  description: 'gp to the garage and check engine',
}]

app.use(
  koaBody({
    urlencoded: true,
  })
);

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
  const { method } = ctx.request.query;
  switch(method) {
    case 'allTickets':
      ctx.response.body = data;
      return;
    case `ticketById&id`:
      const { id } = ctx.request.querystring
      ctx.response.dody = data.filter((el) => {
        if (el.id === id) return el;
      });
    default:
      ctx.response.status = 404;
      return;
  }
})

const server = http.createServer(app.callback()).listen(7070);
