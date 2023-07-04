import { getConnection } from "../database/database.js";
import fs from "fs";


const upLoadPhoto = async (req, res) => {
    try {
        
        let {session_token, test_id, test_txt, photo, partial} = req.body;
        
        
        if(session_token === undefined || test_id === undefined || test_txt === undefined || photo === undefined){
            res.status(400).json({ message: "Los datos suministrados no son correctos." });
        }else{

            const connection = await getConnection();            
            const conlive = await checkSesion(connection,session_token);
           
            if(conlive  && conlive.length > 0){

                // Iniciamos transaccion
                let estado_trans = 0;

                await connection
                    .query("BEGIN")
                    .then( (res)=>{
                        return connection.query("Insert into Photo_test(test_txt, photo, upload_photo) VALUES(?,?,NOW())",[test_txt,photo])
                    })
                    .then((res) =>{
                        const photo_id = res.insertId;
                        return connection.query("Insert into Test_x_photo(test_id,photo_id) VALUES(?,?)", [test_id,photo_id])
                    })
                    .then( (res)=>{
                        let valor = 2;
                        if(partial !== undefined && !partial){
                            valor = 4;
                        }
                        return connection.query("UPDATE Test SET test_status_id = ? where test_id = ? ",[valor, test_id])
                    })
                    .then((res) =>{
                        estado_trans = 1;
                        return connection.query("COMMIT")
                    })
                    .catch((err)=>{
                        console.error("Error durante la transferencia:", err)
		                return connection.query("ROLLBACK")
                    })
                
                if (estado_trans === 1){
                    res.status(200).json({message: "Transaccion Completada"})
                }else{
                    res.status(500).json({message: "Error Durante la Transaccion"})
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

const upLoadFakePhoto = async (req, res) => {
    try {
        
        let {session_token, test_id, test_txt, photo, partial} = req.body;
        
        photo = readcat();
        
        if(session_token === undefined || test_id === undefined || test_txt === undefined || photo === undefined){
            res.status(400).json({ message: "Los datos suministrados no son correctos." });
        }else{

            const connection = await getConnection();            
            const conlive = await checkSesion(connection,session_token);
           
            if(conlive  && conlive.length > 0){

                // Iniciamos transaccion
                let estado_trans = 0;

                await connection
                    .query("BEGIN")
                    .then( (res)=>{
                        return connection.query("Insert into Photo_test(test_txt, photo, upload_photo) VALUES(?,?,NOW())",[test_txt,photo])
                    })
                    .then((res) =>{
                        const photo_id = res.insertId;
                        return connection.query("Insert into Test_x_photo(test_id,photo_id) VALUES(?,?)", [test_id,photo_id])
                    })
                    .then( (res)=>{
                        let valor = 2;
                        if(partial !== undefined && !partial){
                            valor = 4;
                        }
                        return connection.query("UPDATE Test SET test_status_id = ? where test_id = ? ",[valor, test_id])
                    })
                    .then((res) =>{
                        estado_trans = 1;
                        return connection.query("COMMIT")
                    })
                    .catch((err)=>{
                        console.error("Error durante la transferencia:", err)
		                return connection.query("ROLLBACK")
                    })
                
                if (estado_trans === 1){
                    res.status(200).json({message: "Transaccion Completada"})
                }else{
                    res.status(500).json({message: "Error Durante la Transaccion"})
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

const downLoadPhoto = async (req, res) => {
    try {
        
        let {session_token, test_id, photo_id} = req.body;
        
        if(session_token === undefined || (test_id === undefined && photo_id === undefined)){
            res.status(400).json({ message: "Los datos suministrados no son correctos." });
        }else{

            const connection = await getConnection();
            const conlive = await checkSesion(connection,session_token);
           
            if(conlive && conlive.length > 0){
                let resultpartial;
                if(photo_id === undefined)
                {
                    resultpartial = await connection.query("Select photo_id from Test_x_photo where test_id = ?", test_id).map(
                        (current)=>{return current.photo_id});
                        if(resultpartial.length<1){
                            resultpartial = [-1];
                        }
                }else{
                    resultpartial = [photo_id];
                }
                let consulta = "Select test_txt, photo from Photo_test where photo_id IN (" +resultpartial.map(()=>{return '?'}).join(',')+")";
                
                console.log(consulta)
                const result = await connection.query(consulta, resultpartial);                
                
                if(result && result.length > 0){
                    res.json(result);
                }else{
                    res.status(210).json({message:"Foto no disponible."});
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

const checkSesion = async (conn, token) =>{
    await conn.query("CALL checksessions()");
    await conn.query("CALL setconn(?)", token);
    return await conn.query("Select client_id from Client_session where session_active = 1 and session_token like ?", token);
};

const readcat =  () =>{
    const bitmap = fs.readFileSync("Cat03.jpg");
    return bitmap; 
}

export const methods = {
    upLoadPhoto,
    downLoadPhoto,
    upLoadFakePhoto
};