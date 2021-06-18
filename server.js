const http = require("http");
const Koa = require("koa");
const Router = require("@koa/router");
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const Tickets = require("./tickets");

const app = new Koa();
const tickets = new Tickets([]);
tickets.createTicket({
  header: "Say Hello!",
  text: "to my little friend",
});

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

router.get("/tickets", async (ctx) => {
  const { method } = ctx.request.query;
  if (method === "allTickets") {
    console.log("отправил все тикеты");
    ctx.body = tickets.getData();
  }

  if (method === "ticketById") {
    const { id } = ctx.request.query;
    ctx.body = tickets.getTicketbyId(id);
    console.log(`отправил тикет с id:${id}`);
  }
});

router.post("/tickets", async (ctx) => {
  const { method } = ctx.request.query;
  if (method === "createTicket") {
    const { header, text } = ctx.request.query;
    tickets.createTicket({
      header: header,
      text: text,
    });
    ctx.response.status = 204;
    console.log("запостил тикет");
  }
});

router.delete("/tickets/:id", async (ctx) => {
  const { id } = ctx.request.query;
  tickets.deleteTicket(id);
  ctx.response.status = 204;
  console.log(`удалил тикет с id:${id}`);
});

router.put("/tickets/:id", async (ctx) => {
  const { method } = ctx.request.query;
  if (method === "editTicket") {
    const { header, text, id } = ctx.request.query;
    tickets.editTicket(id, {
      header: header,
      text: text,
    });
    ctx.response.status = 204;
    console.log(`изменил тикет с id:${id}`)
  }
  if (method === 'changeStatus') {
    const { id } = ctx.request.query;
    await tickets.changeStatus(id);
    ctx.response.status = 204;
    console.log(`изменил статус тикета с id:${id}`)
  }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));
