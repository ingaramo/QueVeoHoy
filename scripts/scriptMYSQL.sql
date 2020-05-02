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


create table genero (
    id int not null auto_increment primary key,
    nombre varchar(30)
);
alter table pelicula add genero_id int;
alter table pelicula add constraint fk_genero_id foreign key  (genero_id) references genero(id);

create table actor (
    id int not null auto_increment primary key,
    nombre varchar(70)
);
create table actor_pelicula (
    id int not null auto_increment primary key,
    actor_id int,
    pelicula_id int,
    foreign key (actor_id) references actor(id),
    foreign key (pelicula_id) references pelicula(id)
);