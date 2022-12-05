import { Router } from "express";
import { methods  as airDnDController } from "../controller/airDnD.controller";

const router = Router();

router.get("/Clientes",airDnDController.getClients);
router.get("/Cliente/:id",airDnDController.getClient);
router.post("/addCliente",airDnDController.addClient);

export default router;