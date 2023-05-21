
import { Database } from "./dbConnection.js";
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

//routes
// import xxxRoutes from "./src/routes/xxxRoutes.js"
//


const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

dotenv.config();

let PORT = process.env.PORT || 8080;

const db = new Database();
db.connect();

//
// app.user('/xxx', xxxRoyutes)
//

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/', express.static('static-app'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/static-app/index.html'));
})

app.listen(PORT, () => console.log(`Aplicatia Backend asculta pe http://localhost:${PORT}`))