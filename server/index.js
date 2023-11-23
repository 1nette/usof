require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router/router.js');
const cors = require('cors');

const app = express();

// app.use(express.json);
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

app.listen(5000, () => { console.log("Server is running"); });