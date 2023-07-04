import { Router } from "express";
import { methods as test } from "../controller/test.js";
import { methods as photo } from "../controller/photo.js";
import { methods as log } from "../controller/log.js";
import { methods as user } from "../controller/user.js";

const router = Router();

//Test
router.post("/NewTestAvalaible",test.newTestAvalaible);
router.post("/UpLoadTestRequest",test.upLoadTestRequest);
router.post("/CancelTestRequest",test.cancelTestRequest);

//Photo
router.post("/UpLoadPhoto",photo.upLoadPhoto);
router.post("/DownloadPhoto", photo.downLoadPhoto);
router.post("/upLoadFakePhoto", photo.upLoadFakePhoto);


//Login
router.post("/login", log.login);
router.post("/logout", log.logout);
router.post("/infologin", log.infoLogin);

//Usuarios
router.post("/createUser", user.createUser);
router.post("/unSubscribeUser", user.unsubscribeUser);


export default router;