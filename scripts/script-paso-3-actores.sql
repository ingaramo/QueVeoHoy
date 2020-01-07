use queveohoy;
select * from pelicula 
join actor_pelicula on actor_pelicula.pelicula_id = pelicula.id
join actor on actor_pelicula.actor_id = actor.id
where pelicula.id = 1;
select * from actor_pelicula join actor on actor_id = actor.id where pelicula_id = 1