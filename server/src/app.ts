import express from "express";
import serve from "express-static";
import * as path from "path";
import mainRouter from "./routes";

const app = express();

app.use(mainRouter);

app.use("/static", serve(path.join(__dirname, "../../client/build/static")));
app.use(function (req, res) {
  const p = path.join(__dirname, "../../client/build/index.html");
  res.sendfile(p);
});

export default app;
