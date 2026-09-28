import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();
export const sequelize = new Sequelize(process.env.DATABASE_URL || "", {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 20,
        min: 2,
        acquire: 30000,
        idle: 60000,
    },
    logging: false,
})
