const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const koaBody = require("koa-body");
const cors = require("koa2-cors");
const Tickets = require("./tickets");

const app = new Koa();

app.use(
  cors({
    origin: "*",
    credentials: true,
    "Access-Control-Allow-Origin": true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(koaBody({ json: true, text: true, urlencoded: true }));

const router = new Router();

router.get("/tickets", async (ctx, next) => {
  const { method } = ctx.request.query;

  if (method === "allTickets") {
    ctx.response.body = ctx.response.status = 204; // Ваш код, например tickets.getAll();
  }

  if (method === "ticketById") {
    const { id } = ctx.request.query;
    ctx.response.body = ctx.response.status = 204; // Ваш код, например tickets.getById(id);
  }
});

router.post("/tickets", koaBody, async (ctx, next) => {
  const { method } = ctx.request.query;

  if (method === "createTicket") {
    const { name, description } = await JSON.parse(ctx.request.body);
    // Ваш код, например, tickets.create(name,description);
    ctx.response.status = 204;
  }
});

router.delete("/tickets/:id", async (ctx, next) => {
  const ticketId = Number(ctx.params.id);
  // Ваш код, например, tickets.delete(ticketId);
  ctx.response.status = 204;
});

router.put("/tickets/:id", koaBody, async (ctx, next) => {
  const ticketId = Number(ctx.params.id);

  const { status, name, description } = await JSON.parse(ctx.request.body);

  // Ваш код

  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));
