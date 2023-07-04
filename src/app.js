import express from "express";
import morgan from "morgan";

//Routes Import
import oneireRoutes from "./routes/oneire.routes.js";


const app= express();


//Settings
app.set("port",4000);

//Middelwares
app.use(morgan("dev"));
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//Routes
app.use("/api/",oneireRoutes);

export default app;