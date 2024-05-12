import { Sequelize } from "sequelize";
import { DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "../../../config";

export const sequelize = new Sequelize(
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    {
        dialect: DB_DIALECT,
        host: DB_HOST,
        port: DB_PORT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    }
)