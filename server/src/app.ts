import express from "express";
import mainRouter from "./routes";

const app = express();

app.use(mainRouter);

export default app;
