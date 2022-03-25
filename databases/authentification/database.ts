import { Sequelize } from "sequelize-typescript";
import { UserAccount } from "./models/UserAccount";

let BDDInstance: Sequelize;

export async function initBDD() {
  console.log(process.env.MARIADB_DATABASE, process.env.MARIADB_HOST);
  
  const instance = new Sequelize({
    database: process.env.MARIADB_DATABASE,
    dialect: "mariadb",
    host: process.env.MARIADB_HOST,
    logging: process.env.SEQUELIZE_LOGS?.toLocaleLowerCase() === "true" || false, 
    models: [UserAccount],
    password: process.env.MARIADB_PASSWORD,
    port: 3306,
    username: process.env.MARIADB_USER,
  });


  try {
    await instance.authenticate();
    console.log("Connection has been established successfully.");
    BDDInstance = instance;
    return instance;
  }
  catch (error) {
    console.error("Unable to connect to the database", error);
    return null;
  }
}

export function getBDD() {
  return BDDInstance ?? initBDD();
}

export function closeBDD() {
  BDDInstance.close();
}