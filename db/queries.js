import pool from "../config/db.js";

// CREATE USER  
const addUserQuery = async (datos) => {
    try {
        const query = {
            text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *",
            values: datos,
        };
        const result = await pool.query(query);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        return error;
    }
};

// READ USER
const getUserQuery = async () => {
    try {
        const query = {
            text: "SELECT * FROM usuarios",
        };
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        return error;
    }
};

const editUserQuery = async (datos) => {
    try {
        const query = {
            text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3",
            values: datos,
        };
        const result = await pool.query(query);
        if (result.rowCount === 0) {
            throw new Error("No se editó el usuario");
        } else {
            result.rows[0];
        }
    } catch (error) {
        return error;
    }
};

const deleteUserQuery = async (id) => {
    try {
        const query = {
            text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
            values: [id],
        };

        const result = await pool.query(query);
        // delete validation
        if (result.rowCount === 0) {
            throw new Error("No se eliminó el usuario");
        } else {
            result.rows[0];
        }
        return result.rows[0];

    } catch (error) {
        return error;
    }
};

const addTranferQuery = async (datos) => {
    //buscamos el id del emisor
    const { emisor, receptor, monto } = datos;
    const { id: emisorId } = (
        await pool.query(`SELECT * FROM usuarios WHERE nombre = '${emisor}'`)
    ).rows[0];
    //buscamos el id del receptor
    const { id: receptorId } = (
        await pool.query(`SELECT * FROM usuarios WHERE nombre = '${receptor}'`)
    ).rows[0];
    const registerTranfer = {
        text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *",
        values: [emisorId, receptorId, monto],
    };
    const updateBalanceEmisor = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *",
        values: [monto, emisor],
    };
    const updateBalanceReceptor = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *",
        values: [monto, receptor],
    };

    try {
        await pool.query("BEGIN");
        await pool.query(registerTranfer);
        await pool.query(updateBalanceEmisor);
        await pool.query(updateBalanceReceptor);
        await pool.query("COMMIT");
        return true;
    } catch (error) {
        await pool.query("ROLLBACK");
        return error;
    }
};

const getTransferQuery = async () => {
    try {
        const querys = {
            text: `SELECT
                    e.nombre AS emisor,
                    r.nombre AS receptor,
                    t.monto,
                    t.fecha
                FROM
                    transferencias t
                JOIN
                    usuarios e ON t.emisor = e.id
                JOIN
                    usuarios r ON t.receptor = r.id;
        `,
            rowMode: "array",
        };
        const result = await pool.query(querys);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        return error;
    }
};

export { addUserQuery, getUserQuery, editUserQuery, deleteUserQuery, addTranferQuery, getTransferQuery };