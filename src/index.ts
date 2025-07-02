import express, { Request, Response } from "express";
import crypto from "crypto";
import { config } from "dotenv";
import { set, z } from "zod";
import { v7 } from 'uuid';
import { setupCategoryHexagon } from "./modules/category";
import { sequelize } from "./share/component/sequelize";

config();

(async () => {
  await sequelize.authenticate();
  console.log(' Connection has been established successfully.');
  const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/v1', setupCategoryHexagon(sequelize));

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
})();



