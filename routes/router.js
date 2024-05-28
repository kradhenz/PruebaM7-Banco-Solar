import express from "express";
import { home, createUser, readUser, updateUser, deleteUser, createTranfer, readTranfer } from "../controller/userController.js";

const router = express.Router();

router.get("/", home);

router.post("/usuario", createUser);

router.get("/usuarios", readUser);

router.put('/usuario', updateUser);

router.delete('/usuario', deleteUser);

router.post('/transferencia', createTranfer);

router.get('/transferencias', readTranfer);

export default router