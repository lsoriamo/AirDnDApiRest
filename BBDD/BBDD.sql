create database if not exists AparthotelDB;

# Privilegios para `admin`@`%`

GRANT ALL PRIVILEGES ON *.* TO `admin`@`%` IDENTIFIED BY PASSWORD '*67A88380898811C81F629ABCC8B56AFC5DD78FF5' WITH GRANT OPTION;

Create or replace table Apart_Tipe(
	Apart_Tipe_id int auto_increment,
	Shorname VARCHAR(4) not null,
    Description varchar(80) not null,
	Price_min decimal(6,2) not null,
	Price_medium decimal(6,2) not null,
	Price_high decimal(6,2) not null,
	Number_Person int not null,
    primary key(Apart_Tipe_id));

Create or replace table Client(
	ID_Client int auto_increment,
	Name varchar(300) not null,
    Surname varchar(300) not null,
	Direction varchar(500) null,
	Phone varchar(18) not null,
	ID_DOCUMENT varchar(12) not null,
	Email VARCHAR(100) not null,
	Nacionality VARCHAR(120) not null,
	Observation VARCHAR(1000) null,
    primary key(ID_Client)
);

Create or replace table Apart_Name(
	Apart_Name_id int auto_increment,
    Description_Number varchar(80) not null,
	Direction VARCHAR(500) not null,
	Apart_Tipe_id int not null,
	foreign key(Apart_Tipe_id) references Apart_Tipe(Apart_Tipe_id),
    primary key(Apart_Name_id) 
);

Create or replace table Reserve_Status(
	Reserve_Status_id int auto_increment,
	Shortname varchar(4) not null,
	Name varchar(20) not null,
    primary key(Reserve_Status_id)
);

Create or replace table PagosOperacion(
	Operarion_id int auto_increment,
	ID_Client int not null,
	Total decimal(10,2) not null,
	Paid decimal(10,2) not null,
	foreign key(ID_Client) references Client(ID_Client),
    primary key(Operarion_id)
);


Create or replace table Cajas(
	Caja_id int auto_increment,
	Nombre varchar(250) not null,
	BIC VARCHAR(30) null,
	IBAN VARCHAR(30) null,
	primary key(Caja_id)
);


Create or replace table Facturas(
	Facturas_id int auto_increment,
	Concepto VARCHAR(250) not null,
	Paid_Date date not null,
	Cantidad decimal(10,2) not null,
	Caja_id int not null,	
	foreign key(Caja_id) references Cajas(Caja_id),
    primary key(Facturas_id)
);

Create or replace table OperacionxFacturas(
	Operarion_id int not null,
	Facturas_id int not null,
	foreign key(Operarion_id) references PagosOperacion(Operarion_id),
	foreign key(Facturas_id) references Facturas(Facturas_id),
    primary key(Operarion_id, Facturas_id)
);

Create or replace table Reserve_Table(
	Reserve_table_id int auto_increment,
    Apart_Name_id int not null,
	ID_Client int not null,
	Reserve_Status_id int not null,
	Operarion_id int not null,
	Start_Date date not null,
	Finish_Date date not null,
	Details VARCHAR(500) null,
	foreign key(ID_Client) references Client(ID_Client),
	foreign key(Reserve_Status_id) references Reserve_Status(Reserve_Status_id),
	foreign key(Operarion_id) references PagosOperacion(Operarion_id),
	foreign key(Apart_Name_id) references Apart_Name(Apart_Name_id),
    primary key(Reserve_table_id)
);

Create or replace table Incidencia_Status(
	Incidencia_Status_id int auto_increment,
	Incidencia_Status_id int auto_increment,
	Shortname varchar(4) not null,
	Name varchar(20) not null,
    	primary key(Incidencia_Status_id)
);

Create or replace table Incidencias(
	Incidencia_id int auto_increment,
	Incidencia_status_id int not null,
	Description varchar(1000) not null,
	Work_realized varchar(1000) null,
	foreign key(Incidencia_status_id) references Incidencia_Status(Incidencia_status_id),
    primary key(Incidencia_id)
);


--Insert de Prueba;
INSERT INTO `Apart_Tipe` (`Apart_Tipe_id`, `shortname`, `Description`, `Price_min`, `Price_medium`, `Price_high`, `Number_Person`) VALUES
(1, '2HNR', 'Apartamento 2 habitaciones', '50.00', '60.00', '80.00', 4),
(2, '3HNR', 'Apartamento 3 habitaciones', '65.00', '90.00', '110.00', 7);

--CAJAS
INSERT INTO `Cajas` (`Caja_id`, `Nombre`, `BIC`, `IBAN`) VALUES ('1', 'Caja Local1', NULL, NULL), ('2', 'Cuenta Visa(BBVA)', 'BBVAESMM000', 'ES2100001111224444444444');

--Pagos
INSERT INTO `Facturas` (`Facturas_id`, `Concepto`, `Paid_Date`, `Cantidad`, `Caja_id`) VALUES ('1', 'Pago habitacion', '2022-12-07', '237', '1'), ('2','Reserva habitacion', '2022-12-09', '24','2');

--REferencias de los Pagos
INSERT INTO `OperacionxFacturas` (`Operarion_id`, `Facturas_id`) VALUES ('1', '1'), ('2', '2');


INSERT INTO `Apart_Name` (`Apart_Name_id`, `Description_Number`, `Direction`, `Apart_Tipe_id`) VALUES
(1, '1.Piso acogedor con buenas vistas.', 'C. Falsisima junto a la costa', 1),
(2, '2.Piso acogedor con buenas vistas.', 'C. Falsisima junto a la costa', 1);


INSERT INTO `Client` (`ID_Client`, `Name`, `Surname`, `Phone`, `Direction`, `ID_DOCUMENT`, `Email`, `Nacionality`, `Observation`) VALUES
(1, 'Antonio', 'Moreno', '676768923', 'false 11', '213455f', 'correofalso@gmail.com', 'espaniol', NULL),
(2, 'Fernando', 'ErGHeta', '696969696', 'Calle de verdad 34', '213455f', 'ilovefrancia@gmail.com', 'espaniol', NULL),
(3, 'Samuelle', 'Italiano', '787563029', 'Asalf 12', '2134525f', 'deefeff@gmail.com', 'frances', NULL);



INSERT INTO `Incidencia_Status` (`Incidencia_Status_id`, `shortname`, `name`) VALUES
(1, 'OPEN', 'Abierta'),
(2, 'CLSD', 'Cerrada'),
(3, 'PEND', 'Pendiente');


INSERT INTO `Reserve_Status` (`Reserve_Status_id`, `shortname`, `name`) VALUES
(1, 'PEND', 'Pendiente'),
(2, 'PAID', 'Pagado'),
(3, 'RESV', 'Reservado'),
(4, 'END', 'Finalizado'),
(5, 'CANC', 'Cancelado');

INSERT INTO `Reserve_Table` (`Reserve_table_id`, `Apart_Name_id`, `ID_Client`, `Reserve_Status_id`, `Operarion_id`, `Start_Date`, `Finish_Date`, `Details`) 
VALUES 
(NULL, '1', '1', '3', '1', '2022-12-05', '2022-12-10', NULL), (
NULL, '2', '3', '6', '2', '2023-01-02', '2023-01-07', 'Llegada tardia');







