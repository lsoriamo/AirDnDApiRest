import { getConnection } from "../database/database.js";

const newTestAvalaible = async (req, res) => {
    try {
        let {session_token} = req.body
        if(session_token === undefined){
            res.status(400).json({ message: "Es necesario adjuntar un token de session activo." });
        }else{
            
            const connection = await getConnection();
            const conlive = await checkSesion(connection,session_token);

            if(conlive  && conlive.length > 0){
                const client_id = Object.values(JSON.parse(JSON.stringify(conlive)))[0]["client_id"];
                
                const result = await connection.query("Select test_id, test_xml_text from Test where (test_status_id = 1 or test_status_id = 4) and client_id = ? order by creation_test desc limit 1", client_id);
                
                if(result  && result.length > 0){
                    res.json(result[0]);
                }else{
                    //No test status 204
                   res.status(204).json({ message: "No hay pruebas activas." });
                }
                
            }else{
                res.status(401).json({ message: "Es necesario adjuntar un token de session activo." });
            }
        }    
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const upLoadTestRequest = async  (req, res) => {
    try {
        let {session_token, test_xml_text} = req.body
        
        if(session_token === undefined || session_token == null){
            res.status(400).json({ message: "Es necesario adjuntar un token de session activa." });
        }else{
            const connection = await getConnection();
            const conlive = await checkSesion(connection,session_token);
        
            if(test_xml_text === undefined || !checkxml(test_xml_text)){
                res.status(400).json({ message: "Falta Parametro de consulta del Test" });
                return;
            }
           
            if(conlive  && conlive.length > 0){
                const client_id = Object.values(JSON.parse(JSON.stringify(conlive)))[0]["client_id"];

                const activeTest = await connection.query("Select client_id from Test where client_id = ? and (test_status_id=1 or test_status_id=4)",client_id);
                if(activeTest && activeTest.length>0){
                    res.status(409).json({message:"Ya existe una prueba activa. Si necesita cancelarla, use el endpoint correspondiente antes de solicitar una nueva prueba."});
                }else{
                    const result = await connection.query("Insert into Test(client_id, test_status_id, test_xml_text) VALUES( ? , 1 , ? )",[client_id, test_xml_text]);
                    const test_id = result.insertId;
                    res.status(201).json({test_id});
                }
            }else{
                res.status(401).json({ message: "Usuario no Activo" });
            }
        }


    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};     

const cancelTestRequest = async (req,res)=>{
    try {
        let {session_token} = req.body
        if(session_token === undefined){
            res.status(400).json({ message: "Es necesario adjuntar un token de session activa." });
        }else{
            const connection = await getConnection();
            const conlive = await checkSesion(connection,session_token);
            
            if(conlive  && conlive.length > 0){
               
                const client_id = Object.values(JSON.parse(JSON.stringify(conlive)))[0]["client_id"];

                const result = await connection.query("UPDATE Test SET test_status_id = 3 where (test_status_id = 1 or test_status_id = 4) and client_id = ?",client_id);
                
                if(result.affectedRows === 1){
                   res.json({message : "Test Cancelado con exito."});
                }else{
                    res.status(409).json({ message: "No existe ningun Test Activo asociado a su usuario." });
                }
            }else{
                res.status(401).json({ message: "Usuario no Activo" });
            }
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const checkxml= (xml)=>{
    //TO-DO
    return true;
}
const isNumber= (numero)=>{   
    return numero === Number(numero);
}


const checkSesion = async (conn, token) =>{
    await conn.query("CALL checksessions()");
    await conn.query("CALL setconn(?)", token);
    return await conn.query("Select client_id from Client_session where session_active = 1 and session_token like ?", token);
}

export const methods = {
    newTestAvalaible,
    upLoadTestRequest,
    cancelTestRequest,
};