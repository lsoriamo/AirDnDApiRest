import express from "express";
import morgan from "morgan";
//Routes
import airDnDRoutes from "./routes/airDnD.routes";


const app= express();


//Settings
app.set("port",4000);

//Middelwares
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/api/",airDnDRoutes);

export default app;