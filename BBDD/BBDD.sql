create database if not exists ONEIRE_DB;

# Privilegios para `admin`@`%`

USE ONEIRE_DB;


GRANT ALL PRIVILEGES ON *.* TO `admin`@`%` IDENTIFIED BY PASSWORD '*67A88380898811C81F629ABCC8B56AFC5DD78FF5' WITH GRANT OPTION;

Create or replace table Client_group(
	group_id int auto_increment,
	name varchar(20) not null,
	description varchar(1000) null,
    primary key(group_id)
);

Create or replace table Client(
	client_id int auto_increment,
	name varchar(20) not null,
	password varchar(200) not null,
	group_id int not null,
	CONSTRAINT nameUnico UNIQUE (name),
	foreign key(group_id) references Client_group(group_id),
    primary key(client_id)
);

Create or replace table Client_session(
	id_session int auto_increment,
	client_id int not null,
	session_token VARCHAR(3) not null,
	session_initconn datetime not null,
	session_lastconn datetime not null,
	session_active BOOLEAN not null,
	foreign key(client_id) references Client(client_id),
	primary key(id_session)
);
CREATE OR REPLACE TABLE Test_Status(
	test_status_id int auto_increment,
	name varchar(50),
	description varchar(100),
	shortname varchar(3),
    primary key(test_status_id)
);

Create or replace table Photo_test(
	photo_id int auto_increment,
	test_txt varchar(5000),
	photo blob not null,
	upload_photo datetime not null,
    primary key(Photo_id));

Create or replace table Test(
	test_id int auto_increment,
	client_id int not null,
	test_status_id int not null,
	test_xml_text varchar(5000) not null,
	creation_test datetime not null,
	foreign key(client_id) references Client(client_id),
	foreign key(test_status_id) references Test_Status(test_status_id),
	primary key(test_id)
);

Create or replace table Test_x_photo(
	test_id int not null,
	photo_id int not null,
	foreign key(test_id) references Test(test_id),
	foreign key(photo_id) references Photo_test(photo_id),
    primary key(test_id, photo_id) 
);


#Procedure para controlar las sesiones activas.

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `checksessions`()
		BEGIN
        	update Client_session SET session_active = IF(session_lastconn < (NOW()- INTERVAL 1 HOUR), 0, 1) where session_active = 1; 
        END$$
DELIMITER ;

DELIMITER $$
	CREATE DEFINER=`root`@`localhost` PROCEDURE setconn(IN token_session VARCHAR(3))
    	BEGIN
        	update Client_session SET session_lastconn = NOW() where Client_session.session_token like token_session and session_active = 1; 
        END$$
DELIMITER ;

DELIMITER //
CREATE TRIGGER `CreationPhotoTime` BEFORE INSERT ON `Photo_test`
 FOR EACH ROW BEGIN
    SET NEW.upload_photo = NOW();
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER `CreationTestTime` BEFORE INSERT ON `Test`
 FOR EACH ROW BEGIN
    SET NEW.creation_test = NOW();
END//
DELIMITER ;

# Procedure para la gestion del login encriptado desencriptado.
DELIMITER //
	CREATE DEFINER=`root`@`localhost` PROCEDURE RegistrarUsuario(IN nam VARCHAR(200),IN pass VARCHAR(100), IN g_id int)
    	BEGIN
        	INSERT INTO Client(name,Client.password,group_id) VALUES(nam,ENCRYPT(pass,'124879lk'),g_id);
        END//
DELIMITER ;

# Funciones, Procedures para la gestion de session
DELIMITER //
CREATE OR REPLACE FUNCTION Newletter()
returns VARCHAR(1)
BEGIN
DECLARE letter VARCHAR(1);
SET letter= substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (RAND()*36)+1, 1);
return letter;
END//
DELIMITER ;

DELIMITER //
CREATE OR REPLACE FUNCTION Newtoken()
returns VARCHAR(3)
BEGIN
DECLARE token VARCHAR(3);
SET token= Concat(Newletter(),Newletter(),Newletter());
return token;
END//
DELIMITER ;

DELIMITER $$
	CREATE DEFINER=`root`@`localhost` PROCEDURE newSession(IN id_user int)
    	BEGIN
        	DECLARE nt VARCHAR(3);
            
        	UPDATE Client_session c SET c.session_active = 0 where c.session_active=1 and c.client_id = id_user;	
			label1: LOOP
                SET nt = Newtoken();
                if exists (SELECT 1 from Client_session c where c.session_active = 1 and c.session_token = nt) then
                    ITERATE label1;
                END IF;
                LEAVE label1;
			END LOOP label1;
			
			INSERT INTO `Client_session` (`id_session`, `client_id`, `session_token`, `session_initconn`, `session_lastconn`, `session_active`)
				VALUES (NULL, id_user, nt,NOW(),NOW(), '1');
			
			SELECT cs.client_id as id_user, cs.session_token, c.group_id from Client_session cs INNER JOIN Client c on cs.client_id=c.client_id
			where cs.session_active = 1 and c.client_id=id_user;							
        END$$
DELIMITER ;

DELIMITER $$
	CREATE DEFINER=`root`@`localhost` PROCEDURE checkpass(IN usr varchar(200), IN pas VARCHAR(100), OUT ok BOOLEAN, OUT id INT)
    	BEGIN
		   SET ok = false; 
		   SET id = 0;
		   SELECT Client_id INTO id from Client where Client.name like usr and Client.password like ENCRYPT(pas,'124879lk');
		   IF id>0
		   THEN
			 SET ok = true; 
		   END IF;
        END$$
DELIMITER ;


DELIMITER $$
	CREATE DEFINER=`root`@`localhost` PROCEDURE LogSession(IN usr varchar(200), IN pas VARCHAR(100), IN reset BOOLEAN)
    	BEGIN
			DECLARE logvalido BOOLEAN;
			DECLARE existeSesion BOOLEAN;
			DECLARE id INT;
			SET logvalido = false;
			SET id = 0;
			SELECT Client_id INTO id from Client where Client.name like usr and Client.password like ENCRYPT(pas,'124879lk');
			
			IF (id>0)
				THEN
					 SET logvalido = true; 
				END IF;
			IF (logvalido)
				THEN
					if exists (SELECT c.id_session from Client_session c where c.session_active = 1 and c.client_id = id) then
						SET existeSesion = true;
					ELSE
						SET existeSesion = false;
					END IF;
					SELECT Client_id INTO id from Client where Client.name like usr and Client.password like ENCRYPT(pas,'124879lk');
					IF (reset or !existeSesion)
						THEN
							CALL newSession(id);
						ELSE
							SELECT cs.client_id as id_user, cs.session_token, c.group_id from Client_session cs INNER JOIN Client c on cs.client_id=c.client_id
							where cs.session_active = 1 and c.client_id=id;
						END IF;
				ELSE
					Select 0 as id_user, null as session_token, null as group_id;
				END	IF;
        END$$
DELIMITER ;

#Inicializacion de tablas necesarias

# Perfiles usuarios
INSERT INTO `Client_group` (`group_id`, `name`, `description`) VALUES (NULL, 'admin', 'Administrador'),(NULL, 'operator', 'Operador de Pruebas'),(NULL, 'guest', 'Invitado'),(NULL, 'decesed', 'Usuario dado de baja');

# Usuarios
call RegistrarUsuario('Antonio','1234',1);
call RegistrarUsuario('Alberto','1234',1);

# Test Status
INSERT INTO `Test_Status` (`test_status_id`, `name`, `description`, `shortname`) VALUES 
			(NULL, 'Pendiente', 'Test Pendiente', 'PND'),
			(NULL, 'Completado', 'Test Completado', 'CMP'),
			(NULL, 'Cancelado', 'Test Cancelado', 'CNC'),
			(NULL, 'Parcial', 'Test Parcialmente Completado', 'PAR');


delete from Test where test_id in (select t.test_id from Test t left join Test_x_photo p on p.test_id=t.test_id where p.test_id is null)