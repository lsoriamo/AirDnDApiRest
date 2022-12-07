import { getConnection } from "../database/database";

const getClients = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("Select * from Client");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getClient = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("Select * from Client where ID_Client = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addClient = async (req, res) => {

    try {
        const connection = await getConnection();
        const { name, surname, direction, id_document, email, nacionality } = req.body;

        if (name === undefined || surname === undefined || direction === undefined || id_document === undefined ||
            email === undefined || nacionality === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all fields." });
        } else {
            const cliente = { name, surname, direction, id_document, email, nacionality };
            const result = await connection.query("INSERT INTO Client SET ?", cliente);

            res.json(result)
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }

};

const deleteClient = async (req, res) => {
    try {
        const connection = await getConnection();
        const { id, delpassword } = req.body;

        if ((id !== undefined && id !== "") && delpassword === "hufrpmcrecyhgvi") {
            const result = await connection.execute("DELETE FROM Client SET WHERE ID_Client = ?", id);
            res.json(result)
        } else {
            res.status(400).json({ message: "Bad Request." });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const updateClient = async (req, res) => {
    try {
        const connection = await getConnection();
        const { id, autoritypassword } = req.body;

        if ((id !== undefined && id !== "") && autoritypassword === "hufrpmcrecyhgvi") {
            let { name, surname, direction, id_document, email, nacionality  } = req.body;
            
            const oldRow = await connection.query("Select * from Client where ID_Client = ?", id);
            const oldRowJson = Object.values(JSON.parse(JSON.stringify(oldRow)))[0];
            console.log(oldRowJson)
            
            if (name === undefined){ name = oldRowJson["Name"]}
            if (surname === undefined){ surname = oldRowJson["Surname"]}
            if (direction == undefined){ direction = oldRowJson["Direction"]}
            if (id_document == undefined){ id_document = oldRowJson["ID_DOCUMENT"]}
            if (email == undefined){ email = oldRowJson[" Email"]}
            if (nacionality == undefined){ nacionality = oldRowJson["Nacionality"]}
            console.log(oldRowJson["Surname"])
            console.log (name,surname)

            res.status(400).json({ message: "JSON." });
        
           
           // const result = await connection.execute("UPDATE Client Set name = ?,surname = ?,direction = ?,id_document = ?,email = ?,nacionality = ? where ID_Client = ?"
            //, name, surname, direction, id_document, email, nacionality, id);
        //res.json(result);
        } else {
            res.status(400).json({ message: "Bad Request." });
        }
       
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


export const methods = {
    getClients,
    getClient,
    addClient,
    deleteClient,
    updateClient,

};