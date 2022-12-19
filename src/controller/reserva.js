import { getConnection } from "../database/database";

const getReserves = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("Select * from Reserve_Table");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getReserve = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("Select * from Reserve_Table where Reserve_table_id = ?", id);
        res.json(result[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addReserve = async (req, res) => {

    try {
        const connection = await getConnection();
        let { apart_name_id, id_client,reserve_status_id, total, paid, start_date, finish_date, details } = req.body;
        console.log(req.body)
        if (apart_name_id === undefined || id_client === undefined || reserve_status_id === undefined || total === undefined ||
            start_date === undefined || finish_date === undefined ) {
            console.log(apart_name_id+"-"+id_client+"-"+reserve_status_id+"-"+total+"-"+start_date+"-"+finish_date);
            res.status(400).json({ message: "Bad Request. Please fill all fields." });
        } else {
            start_date = new Date(start_date)
            finish_date = new Date(finish_date)

            const reserva = { apart_name_id, id_client, reserve_status_id, total, paid, start_date, finish_date, details };
            const result = await connection.query("INSERT INTO Reserve_Table SET ?", reserva);

            res.json(result)
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }

};

const deleteReserve = async (req, res) => {
    try {
        const connection = await getConnection();
        const { id } = req.params;

        if (id !== undefined && id !== "") {
            const result = await connection.query("DELETE FROM Reserve_Table WHERE Reserve_table_id = ?", id);
            res.json(result)
        } else {
            res.status(400).json({ message: "Bad Request." });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const updateReserve = async (req, res) => {
    try {
        const connection = await getConnection();
        const { reserve_table_id  } = req.body;

        if (reserve_table_id !== undefined && reserve_table_id !== "") {
            const { apart_name_id, id_client,reserve_status_id, total, paid, start_date, finish_date, details } = req.body;

    
            const oldRow = await connection.query("Select * from Reserve_Table where Reserve_table_id = ?", reserve_table_id);
            const oldRowJson = Object.values(JSON.parse(JSON.stringify(oldRow)))[0];
            
            if (apart_name_id === undefined){ apart_name_id = oldRowJson["Apart_Name_Id"]}
            if (id_client === undefined){ id_client = oldRowJson["ID_Client"]}
            if (reserve_status_id == undefined){ reserve_status_id = oldRowJson["Reserve_Status_id"]}
            if (total == undefined){ total = oldRowJson["Total"]}
            if (paid == undefined){ paid = oldRowJson["Paid"]}
            if (start_date === undefined)
                { start_date = oldRowJson["Start_Date"]}
            else{
                  start_date = new Date(start_date)
                  console.log(start_date)}
            if (finish_date == undefined)
                { finish_date = oldRowJson["Finish_Date"]}
            else{
                finish_date = new Date(finish_date)}
            if (details == undefined){ details = oldRowJson["Details"]}
            
            start_date = new Date(start_date)
            console.log("Date"+start_date)


            let reserva ={ apart_name_id, id_client,reserve_status_id, total, paid, start_date, finish_date, details } 
                 
            const result = await connection.query("UPDATE Reserve_Table Set name = ? where Reserve_table_id = ?", [reserva, reserve_table_id]);
            res.json(result);
        } else {
            res.status(500).json({ message: "Bad Request." });
        }
       
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const checkinReserve = async (req, res) => {
    try {
        const connection = await getConnection();
        let { date } = req.params;

        if (date !== undefined && date !== "") {
            date = new Date(date)
            const result = await connection.query(
                "Select c.name, c.surname, c.email, rt.Apart_Name_id, rt.start_date, rt.details from Reserve_Table rt"+
                " inner join Client c on rt.id_client = c.id_client"+
                " WHERE start_date = ?", date);
            res.json(result)
        } else {
            res.status(400).json({ message: "Bad Request." });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const checkoutReserve = async (req, res) => {
    try {
        const connection = await getConnection();
        let { date } = req.params;

        if (date !== undefined && date !== "") {
            date = new Date(date)
            const result = await connection.query(
                "Select c.name, c.surname, c.email, rt.Apart_Name_id, rt.start_date, rt.details from Reserve_Table rt"+
                " inner join Client c on rt.id_client = c.id_client"+
                " WHERE start_date = ?", date);
            res.json(result)
        } else {
            res.status(400).json({ message: "Bad Request." });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}


export const methods = {
    getReserves,
    getReserve,
    addReserve,
    deleteReserve,
    updateReserve,
    checkinReserve,
    checkoutReserve
};