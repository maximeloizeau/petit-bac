import express from "express";
import mainRouter from "./routes";

const app = express();
app.set("port", process.env.PORT || 8080);

app.use(mainRouter);

export default app;
