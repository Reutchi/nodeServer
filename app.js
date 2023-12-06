const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Serverul rulează la adresa http://localhost:${port}`);
});
