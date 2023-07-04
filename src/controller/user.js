import { getConnection } from "../database/database.js";

const createUser = async (req, res) => {
    try {
        const { session_token, new_user, pass_new_user, group_id_join } = req.body;

        if(session_token === undefined || new_user === undefined || pass_new_user === undefined || group_id_join === undefined || !isNumber(group_id_join)){
            res.status(400).json({ message: "Falta suministrar datos necesarios." });
        }else{
            const connection = await getConnection();
            const conlive = await checkSesion(connection,session_token);
            
            if(conlive && conlive.length > 0){
                
                if(conlive[0].group_id=1){
                    const nameExits = await connection.query("SELECT name from Client where name like ?", new_user);
                    if(nameExits && nameExits.length > 0){
                        res.status(409).json({message: "Error durante la creacion del usuario."});
                        return;
                    }
                    const result = await connection.query("Call RegistrarUsuario(?, ?, ?);",[new_user, pass_new_user, group_id_join]);
                    if(result.affectedRows===1){
                        res.json({message: "Usuario Creado."});
                    }else{
                        res.status(409).json({message: "Error durante la creacion del usuario."});
                    }
                }
                else{
                    res.status(401).json({ message: "Solo los usuarios Administradores pueden crear usuarios." });
                }
            }else{
                res.status(401).json({ message: "Es necesaria una session activa para realizar esta operacion." });
            }
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const unsubscribeUser = async (req, res) => {
    try {

        const { session_token, del_user } = req.body;
        if(session_token === undefined || del_user === undefined){
            res.status(400).json({ message: "Falta suministrar datos necesarios." });
        }else{
            const connection = await getConnection();
            const conlive = await checkSesion(connection,session_token);
            
            if(conlive && conlive.length > 0){
               
                if(conlive[0].group_id=1){
                    const result = await connection.query("UPDATE Client SET id_group=4 where name like ?;",del_user);
                    if(result.affectedRows===1){
                        res.json({message: "Usuario Dado de Baja."});
                    }else{
                        res.status(409).json({message: "Error durante el proceso de baja de usuario, es posible que el identificador de usuario sea erroneo."});
                    }
                }
                else{
                    res.status(401).json({ message: "Solo los usuarios Administradores pueden eliminar usuarios." });
                }
            }else{
                res.status(401).json({ message: "Es necesaria una session activa para realizar esta operacion." });
            }
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const isNumber= (num) => {
    return num === Number(num);
}

const checkSesion = async (conn, token) =>{
    await conn.query("CALL checksessions()");
    await conn.query("CALL setconn(?)", token);
    return await conn.query("Select cs.client_id, c.group_id from Client_session cs INNER JOIN Client c on c.client_id=cs.client_id where cs.session_active = 1 and cs.session_token like ?", token);
};

export const methods = {
    createUser,
    unsubscribeUser
};