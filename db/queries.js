import pool from '../config/db.js';

// Helper function for query execution
const executeQ = async (query) => {
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
};

// CREATE USER
const createUserQ = async (datos) => { 
    const query = {
        text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *",
        values: datos,
    };
    const result = await executeQ(query);
    return result[0];
};

// READ/SHOW ALL USERS
const readtUserQ = async () => {
    const query = {
        text: "SELECT * FROM usuarios",
    };
    return await executeQ(query); // 
};

// UPDATE USER 
const updateUserQ = async (datos) => {
    const query = {
        text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
        values: datos,
    };
    const result = await executeQ(query);
    if (result.length === 0) {
        throw new Error("No se encontró el usuario");
    }
    return result[0];
};

// DELETE USER BY ID
const deleteUserQ = async (id) => {
    const query = {
        text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
        values: [id],
    };
    const result = await executeQ(query);
    if (result.length === 0) {
        throw new Error("No se encontró el usuario");
    }
};

// CREATE TRANSFER
const createTranferQ = async (datos) => {
    const { emisor, receptor, monto } = datos; // destructuring the object
    const emisorQ = `SELECT id FROM usuarios WHERE nombre = $1`;
    const receptorQ = `SELECT id FROM usuarios WHERE nombre = $2`;

    // Get emisor and receptor IDs
    const emisorId = (await executeQ({ text: emisorQ, values: [emisor] }))[0].id;
    const receptorId = (await executeQ({ text: receptorQ, values: [receptor] }))[0].id;

    // Transfer QUERY
    const transferQ = {
        text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *",
        values: [emisorId, receptorId, monto],
    };

    // Emisor balance update QUERY
    const updateEmisorQ = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *",
        values: [monto, emisor],
    };
    
    // Receptor balance QUERY
    const updateReceptorQ = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *",
        values: [monto, receptor],
    };

    try {
        await pool.query("BEGIN"); // starts the transaction
        await executeQ(transferQ); // executes the transfer query
        await executeQ(updateEmisorQ); // updates the emisor balance
        await executeQ(updateReceptorQ); // updates the receptor balance
        await pool.query("COMMIT"); // commits the transaction
        return true;
    } catch (error) {
        await pool.query("ROLLBACK"); // rolls back the transaction
        throw new Error(error);
    }
};

// READ TRANSFER
const readTransferQ = async () => {
    const query = {
        text: `SELECT
                e.nombre AS emisor,
                r.nombre AS receptor,
                t.monto,
                t.fecha
            FROM transferencias t
            JOIN usuarios e ON t.emisor = e.id
            JOIN usuarios r ON t.receptor = r.id;
        `,
        rowMode: "array",
    };
    return await executeQ(query); // returns an array and call function
};

export { createUserQ, readtUserQ, updateUserQ, deleteUserQ, createTranferQ, readTransferQ };