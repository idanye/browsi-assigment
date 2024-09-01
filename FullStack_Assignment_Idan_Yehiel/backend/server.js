import express from "express";
import cors from "cors";
import fs from "fs";
import path from 'path';
import publishersRouter from "./routers/publishers.js";
import domainsRouter from "./routers/domains.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4300;
const app = express();
const data = fs.readFileSync("./db.json", "utf8");

const dbPath = path.join(__dirname, 'db.json');

let parsedData;
try {
    parsedData = JSON.parse(data);
} catch (error) {
    console.error("Error parsing db.json:", error);
    parsedData = { publishers: [] };
}

export const publishers = parsedData;
export const domains = parsedData.flatMap(publisher => publisher.domains); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/publishers", publishersRouter);
app.use("/api/domains", domainsRouter);

app.listen(PORT, console.log(`Server is listening on port ${PORT}`));

export const saveDatabase = () => {
    const data = JSON.stringify(publishers, null, 2);
    fs.writeFileSync(dbPath, data, 'utf8');
};

