Crear una carpeta para vincular el volumen con windows(si se desea - dicha ruta es la que se debera poner en el docker en mi caso C:\Docker-VV\ONEIRE-APIREST)

docker run --name myXampp -p 41061:22 -p 43306:3306 -p 41062:80 -d -v C:\Docker-VV\ONEIRE-APIREST:/www tomsik68/xampp:8

Antes de lanzar el SQL de creación de BBDD es necesario actualizar la BBDD(seguir los pasos abajo indicados)

Actualizar la BBDD
conectarte por ssh al puerto 41061 usuario root pass root
ejecutar
/opt/lampp/bin/mysql_upgrade -u root -p
PASS VACIO

Lanzar las instrucciones que estan en el archivo BBDD.SQL dentro de la BBDD.

Podeis usar el phpmyadmin que trae el Xampp (localhost:41062/phpmyadmin)

Despues de que se haya lanzado el script se crea un usuario admin con permiso de acceso total(redes externas puerto 43306).

Usuario MariaDB: 'admin' Password: 's3rv3r'
