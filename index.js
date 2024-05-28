import express from 'express';
import path from 'path';
import router from './routes/router.js';

const app = express();
const port = 3000;

// Static files
app.use('/', router);

// Undefined route managament
app.get('*', (req, res) => {
    res.send('<center><h1>This page does not exist...👻</h1></center>');
});

// Express server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});