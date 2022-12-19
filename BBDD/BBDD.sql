create database if not exists AparthotelDB;

Create or replace table Apart_Tipe(
	Apart_Tipe_id int auto_increment,
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
	ID_DOCUMENT varchar(12) not null,
	Email VARCHAR(100) not null,
	Nacionality VARCHAR(120) not null,
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
	shortname varchar(4) not null,
	name varchar(20) not null,
    primary key(Reserve_Status_id)
);

Create or replace table Reserve_Table(
	Reserve_table_id int auto_increment,
    	Apart_Name_id int not null,
	ID_Client int not null,
	Reserve_Status_id int not null,
	Total decimal(10,2) not null,
	Paid decimal(10,2) not null,
	Start_Date date not null,
	Finish_Date date not null,
	Details VARCHAR(500) null,
	foreign key(ID_Client) references Client(ID_Client),
	foreign key(Reserve_Status_id) references Reserve_Status(Reserve_Status_id),
	foreign key(Apart_Name_id) references Apart_Name(Apart_Name_id),
    	primary key(Reserve_table_id)
);

Create or replace table Incidencia_Status(
	Incidencia_Status_id int auto_increment,
	shortname varchar(4) not null,
	name varchar(20) not null,
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


//Insert de Prueba;
INSERT INTO `Apart_Tipe` (`Apart_Tipe_id`, `shortname`, `Description`, `Price_min`, `Price_medium`, `Price_high`, `Number_Person`) VALUES
(1, '2HNR', 'Apartamento 2 habitaciones', '50.00', '60.00', '80.00', 4),
(2, '3HNR', 'Apartamento 3 habitaciones', '65.00', '90.00', '110.00', 7);

INSERT INTO `Apart_Name` (`Apart_Name_id`, `Description_Number`, `Direction`, `Apart_Tipe_id`) VALUES
(1, '1.Piso acogedor con buenas vistas.', 'C. Falsisima junto a la costa', 1),
(2, '2.Piso acogedor con buenas vistas.', 'C. Falsisima junto a la costa', 1);

INSERT INTO `Client` (`ID_Client`, `Name`, `Surname`, `Direction`, `ID_DOCUMENT`, `Email`, `Nacionality`) VALUES
(1, 'Antonio', 'Moreno', 'false 11', '213455f', 'correofalso@gmail.com', 'espaniol'),
(3, 'Fernando', 'ErGHeta', 'Calle de verdad 34', '213455f', 'ilovefrancia@gmail.com', 'espaniol'),
(4, 'Samuelle', 'Italiano', 'Asalf 12', '2134525f', 'deefeff@gmail.com', 'frances');


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

INSERT INTO `Reserve_Table` (`Reserve_table_id`, `Apart_Name_id`, `ID_Client`, `Reserve_Status_id`, `Total`, `Paid`, `Start_Date`, `Finish_Date`, `Details`) VALUES
(1, 1, 1, 3, '237.00', '237.00', '2022-12-05', '2022-12-09', 'Necesita una mesita de noche'),
(2, 1, 3, 8, '237.00', '0.00', '2022-12-06', '2022-12-08', 'No pudo venir por retraso del avion.'),
(3, 1, 1, 6, '256.00', '40.00', '2022-12-13', '2022-12-16', 'Chek-in 7PM'),
(4, 1, 3, 3, '300.00', NULL, '2023-01-02', '2023-05-02', ''),
(5, 2, 3, 3, '300.00', NULL, '2023-01-02', '2023-05-02', '');






