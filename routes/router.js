import express from "express";
import { home, createUser, readUser, updateUser, deleteUser, addTranfer, getTranfer } from "../controller/userController.js";

const router = express.Router();

router.get("/", home)

router.post("/usuario", createUser)

router.get("/usuarios", readUser)

router.put('/usuario', updateUser)

router.delete('/usuario', deleteUser)

router.post('/transferencia', addTranfer)

router.get('/transferencias', getTranfer)

export default router