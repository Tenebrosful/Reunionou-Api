import { Sequelize } from "sequelize-typescript";

let BDDInstance: Sequelize;

export async function initBDD() {
  console.log(process.env.MARIADB_DATABASE, process.env.BDD_DRIVER, process.env.MARIADB_HOST, process.env.MARIADB_PASSWORD, process.env.MARIADB_USER);

const instance = new Sequelize({
  database: process.env.MARIADB_DATABASE,
  dialect: "mariadb",
  host: process.env.MARIADB_HOST,
  models: [],
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