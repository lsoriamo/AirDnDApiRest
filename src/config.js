//import {config} from "dotenv"

//config();

import dotenv from "dotenv"

dotenv.config({ path: './.env' });

//console.log(process.env); // Add this line


export default{
    host: process.env.HOST || "",
    port: process.env.PORT || "",
    database: process.env.DATABASE || "",
    user: process.env.USER || "",
    password: process.env.PASSWORD || ""
}

/*export default{
    host: "localhost",
    port: "43306",
    database: "ONEIRE_DB",
    user: "admin",
    password: "s3rv3r"
}*/