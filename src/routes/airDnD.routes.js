import { Router } from "express";
import { route } from "express/lib/application";
import { methods  as cliente } from "../controller/cliente";
import { methods  as reserva } from "../controller/reserva";

const router = Router();

//Cliente
router.get("/Clientes",cliente.getClients);
router.get("/Cliente/:id",cliente.getClient);
router.post("/addCliente",cliente.addClient);
router.get("/delCliente/:id",cliente.deleteClient);
router.post("/updateCliente",cliente.updateClient);


//Reserva
router.get("/Reservas",reserva.getReserves);
router.get("/Reserva/:id",reserva.getReserve);
router.post("/addReserva",reserva.addReserve);
router.get("/delReserva/:id",reserva.deleteReserve);
router.post("/updateReserva",reserva.updateReserve);
router.get("/checkin/:date",reserva.checkinReserve);
router.get("/checkout/:date",reserva.checkoutReserve);

export default router;