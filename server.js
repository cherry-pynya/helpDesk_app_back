const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const { nextTick } = require("process");

const app = new Koa();
const data = [1, 1, 1]

app.use(
  koaBody({
    urlencoded: true,
  })
);

app.use(async (ctx, next) => {
  ctx.response.body = data;
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
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
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

const server = http.createServer(app.callback()).listen(7070);
