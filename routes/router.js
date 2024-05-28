// import { home, addUser, getUser, editUser, deleteUser, addTranfer, getTranfer } from "../controller/user.js";
import { addUserQuery, getUserQuery, editUserQuery, deleteUserQuery, addTranferQuery, getTransferQuery} from "../db/queries.js";
import express from "express";
import path from "path";

const __dirname = import.meta.dirname;
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
})

router.post("/usuario", async (req, res) => {
    try {
        const { nombre, balance } = req.body;
        const datos = [nombre, balance];
        const result = await addUserQuery(datos);
        res.status(200).send(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
});

// read/show route
router.get("/usuarios", async (req, res) => {
    try {
        const result = await getUserQuery();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// edit route
router.put('/usuario', async (req, res) => {
    try {
        const { id } = req.query;
        const { nombre, balance } = req.body;
        const datos = [nombre, balance, id];
        const result = await editUserQuery(datos);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// delete route
router.delete('/usuario', async (req, res) => {
    try {
        const { id } = req.query;
        const result = await deleteUserQuery(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/transferencia', async (req, res) => {
    try {
        console.log("body", req.body);
        const datos = req.body;
        console.log(datos);

        const result = await addTranferQuery(datos);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/transferencias', async (req, res) => {
    try {
        const result = await getTransferQuery();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router