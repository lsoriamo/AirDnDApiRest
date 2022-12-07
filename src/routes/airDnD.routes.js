import { Router } from "express";
import { methods  as cliente } from "../controller/cliente";

const router = Router();

//Cliente
router.get("/Clientes",cliente.getClients);
router.get("/Cliente/:id",cliente.getClient);
router.post("/addCliente",cliente.addClient);
router.post("/delCliente",cliente.deleteClient);
router.post("/updateCliente",cliente.updateClient);



export default router;