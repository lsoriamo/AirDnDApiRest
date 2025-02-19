import mysql from "promise-mysql";
import config from "../config.js";

const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password
})

export const getConnection = ()=>{
    return connection;
}