import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { User } from "@models/user/User";
import { Orbies } from "@models/orbies/Orbies";

const dbDialect = process.env.DB_DIALECT as Dialect;
const db = process.env.DB as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;
const dbPort = parseInt(process.env.DB_PORT as string);

export const sequelize = new Sequelize(db, dbUser, dbPassword, {
  dialect: dbDialect,
  host: dbHost,
  port: dbPort,
  models: [User, Orbies],
  repositoryMode: true,
  dialectOptions: {
    ssl: process.env.DB_ENABLE_SSL == 'true' && {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
