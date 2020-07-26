/**
 * Server index module
 * @module server
 */
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const cookieParser = require('cookie-parser');
const routes = require("./routes/index");
const app = express();
mongoose.connect('mongodb+srv://admin:adminulacitoifapassword@cluster-fz8qx.mongodb.net/vinil?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors({ origin: /[localhost:3000|http://192\.168\.0\.9:3000]/, methods: ['GET', 'PUT', 'POST', 'DELETE'], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));
Object.entries(routes).forEach(([path, router]) => app.use(`/api/v1/${path}`, router));
app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/../build/index.html')));
app.use((err, req, res, next) => res.status(500).send({ error: err }));
app.listen(process.env.PORT || 8080);