create database QueVeoHoy;
use QueVeoHoy;
create table pelicula(
    id int not null auto_increment primary key,
    titulo varchar(100),
    duracion int(5),
    director varchar(400),
    anio int(5),
    fecha_lanzamiento datetime,
    puntuacion int(2),
    poster varchar(300),
    trama varchar(700)
);