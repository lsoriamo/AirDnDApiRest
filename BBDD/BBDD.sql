create database if not exists AparthotelDB;

Create or replace table Apart_Tipe(
	Apart_Tipe_id int auto_increment,
    Description varchar(80) not null,
	Price_min decimal(4,2) not null,
	Price_medium decimal(4,2) not null,
	Price_high decimal(4,2) not null,
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
	ID_Client int not null,
    Description varchar(80) not null,
	Price_min decimal(4,2) not null,
	Price_medium decimal(4,2) not null,
	Price_high decimal(4,2) not null,
	N_Rooms int not null,
	foreign key(ID_Client) references Client(ID_Client),
    primary key(Reserve_Status_id)
);

Create or replace table Reserve_Table(
	Reserve_table_id int auto_increment,
    Apart_Name_id int not null,
	Start_Date date not null,
	Finish_Date date not null,
	status int not null,	
	Details VARCHAR(500) null,
	foreign key(Apart_Name_id) references Apart_Name(Apart_Name_id),
    primary key(Reserve_table_id)
);

