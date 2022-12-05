import {config} from "dotenv"

config();

export default{
    host: process.env.host || "",
    port: process.env.port || "",
    database: process.env.database || "",
    user: process.env.user || "",
    password: process.env.password || ""
}