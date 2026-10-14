import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

const databaseUrl = process.env.DATABASE_URL || "";
const isLocalDatabase = /^postgres(ql)?:\/\/[^@]*@(localhost|127\.0\.0\.1|\[::1\])([:/?]|$)/.test(databaseUrl);

export const sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    dialectOptions: isLocalDatabase ? {} : {
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
