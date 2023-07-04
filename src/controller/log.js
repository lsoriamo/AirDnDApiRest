import { getConnection } from "../database/database.js";


const login = async (req, res) => {
    console.log("Login function called.");
    try {            
        let {user, password, reset} = req.body;
        if(user === undefined || password === undefined){
            res.status(400).json({ message: "Falta suministrar datos necesarios." });
        }else{
            if(reset===undefined || reset !== true ){
                reset=false;
            }
        const connection = await getConnection();
        const result = await connection.query("Call LogSession(?,?,?)", [user,password,reset]);

        if(result[0][0].id_user !== 0)
        {
            res.json(result[0][0]);
        }else{
            res.status(401).json({ message: "Fallo de autentificación" });
        }
        }
    } catch (error) {
        console.log("Error in login function:", error);
        res.status(500);
        res.send(error.message + " hola");
    }
}

const logout = async (req, res) => {
    try {
        let {session_token} = req.body;          
        if(session_token === undefined){
            res.status(400).json({ message: "Falta suministrar datos necesarios." });
        }else{ 
        const connection = await getConnection();
        await connection.query("UPDATE Client_session SET session_active=0 where session_active=1 and session_token like ?", session_token);
        
            res.json({ message: "Session Cerrada" });
        } 
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const infoLogin = async (req, res) => {
    try {
        let {session_token} = req.body;          
        if(session_token === undefined){
            res.status(400).json({ message: "Falta suministrar datos necesarios." });
        }else{ 
        const connection = await getConnection();
        const result = await connection.query("SELECT session_active FROM `Client_session` WHERE session_token = ?", session_token);
        
            res.json(result[0]);
        } 
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const methods = {
    login,
    logout,
    infoLogin
};