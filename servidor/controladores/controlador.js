const connection = require('../lib/conexionbd.js');

function connect(){
    connection.connect(function(error){
        if(error){
            console.log('ERROR: '+ error );
        }
        else{
            console.log('conexion exitosa');
        }
    })  
}
function disconnect(){
    connection.end(function(error){
        if(error){
            console.log('Error: '+ error)
        }else{
            console.log("coneccion cerrada correctamente")
        }
        
    });
}
function makeQuery(req){
    let query = 'select * from pelicula join genero on pelicula.genero_id = genero.id where true ';
    if(req.query.anio != null){
        query += `and pelicula.anio = ${req.query.anio} `;
    }
    if(req.query.titulo != null){
        query += `and pelicula.titulo like '%${req.query.titulo}%' `;
    }
    if(req.query.genero != null){
        query += `and genero.id = ${req.query.genero} `;
    }
    if(req.query.columna_orden != null){
        query += `order by ${req.query.columna_orden} `;
    }
    if(req.query.tipo_orden != null){
        query += ` ${req.query.tipo_orden} `;
    }
    if(req.query.pagina != null && req.query.cantidad){
        let inicio = (req.query.pagina-1 )*  req.query.cantidad;
        let final = req.query.pagina * req.query.cantidad;
        query += `limit  ${inicio},${final}`;
    }
    query += ';'
    return query
}
function getAllPeliculas(req, res){

    let query = makeQuery(req);

    let peliculas=[];
    connection.query(query, function(error, result){
        if(error){
            console.log('Error: '+ error);
            res.status(400).send('error en la consulta');
        }
        else{
            for(let i = 0 ; i<result.length ; i++){
                let pelicula = {
                    id: result[i].id,
                    titulo: result[i].titulo,
                    duracion: result[i].duracion,
                    director: result[i].director,
                    anio: result[i].anio,
                    fecha_lanzamiento: result[i].fecha_lanzamiento,
                    puntuacion: result[i].puntuacion,
                    poster: result[i].poster,
                    trama: result[i].trama
                }
                peliculas.push(pelicula);
            }
            
            req.query.pagina = null;
            let query1 = makeQuery(req)
            connection.query(query1, function (error,result1){
                if(error){
                    console.log('Error: '+ error);
                    res.status(400).send('error en la consulta');
                }
                else {

                    let data = {
                        'peliculas': peliculas,
                        'total': result1.length
                    }
                    res.status(201).send(data)
                }
            })
        }
    });
}

function getAllGeneros(req,res){
    let generos=[];
    connection.query('select * from genero', function(error, result){
        if(error){
            console.log('Error: '+ error);
            res.status(400).send('error en la consulta');
        }
        else{
            for(let i = 0 ; i<result.length ; i++){
                let genero = {
                    id: result[i].id,
                    nombre: result[i].nombre,
                }
                generos.push(genero);
            }
            let data = {
                'generos': generos
            }
            res.status(201).send(data)
        }
    });

}
function getPelicula(req,res){
    let data;
    let actores = [] ;
    let pelicula;
    let genero;    
    let query1 = `select p.*, a.nombre, g.nombre as g_nombre, g.id as g_id from pelicula p 
    join actor_pelicula ac on p.id = ac.pelicula_id
    join actor a on a.id= ac.actor_id
    join genero g on p.genero_id = g.id
    where p.id=${req.params.id}`
    connection.query(query1 , function(error, result){
        if(error){
            console.log('Error: '+ error);
            res.status(400).send('error en la consulta' );
        }
        else{
            for(let i = 0 ; i<result.length ; i++){
                let actor = {
                    id: result[i].id,
                    nombre: result[i].nombre
                }
                actores.push(actor);

                if(i > 1){continue}
                pelicula = {
                    id: result[0].id,
                    titulo: result[0].titulo,
                    duracion: result[0].duracion,
                    director: result[0].director,
                    anio: result[0].anio,
                    fecha_lanzamiento: result[0].fecha_lanzamiento,
                    puntuacion: result[0].puntuacion,
                    poster: result[0].poster,
                    trama: result[0].trama
                }
                genero= {
                    nombre: result[0].g_nombre,
                    id: result[0].g_id
                }              
            }
            data= {
                actores: actores,
                pelicula: pelicula,
                genero: genero
            }
            res.status(201).send(data)
        }
        
    });
}

function getRecomendacion(req,res){
    let defaultQuery='';
    if(req.query.length != 0){
        
        let query = makeRecomendation(req);
        let peliculas=[];
        connection.query(query, function(error, result){
            if(error){
                console.log('Error: '+ error);
                res.status(400).send('error en la consulta');
            }
            else{
                for(let i = 0 ; i<result.length ; i++){
                    let pelicula = {
                        nombre: result[i].nombre,
                        titulo: result[i].titulo,
                        poster: result[i].poster,
                        trama: result[i].trama
                    }
                    peliculas.push(pelicula);
                }
                let data = {
                    'peliculas': peliculas,
                }
                res.status(201).send(data)
            }
        });
    }
    else {
        connection.query(defaultQuery, function(error, result){
            if(error){
                console.log('Error: '+ error);
                res.status(400).send('error en la consulta');
            }
            else{
                for(let i = 0 ; i<result.length ; i++){
                    let pelicula = {
                        nombre: result[i].nombre,
                        titulo: result[i].titulo,
                        poster: result[i].poster,
                        trama: result[i].trama
                    }
                    peliculas.push(pelicula);
                }
                let data = {
                    'peliculas': peliculas,
                }
                res.status(201).send(data)
            }
        });

    }
}
function makeRecomendation(req){
    let query = 'select *, genero.nombre as nombre from pelicula join genero on pelicula.genero_id = genero.id where true ';
    if(req.query.anio_inicio != null){
        query += `and "''${req.query.anio_fin}--12--31">=pelicula.anio >= "'${req.query.anio_inicio}--01--01'"`;
    
    }
    if(req.query.genero != null){
        query += `and genero.nombre = "${req.query.genero}" `;
    }
    query += ';'
    return query
}
module.exports = {
    getAllPeliculas : getAllPeliculas,
    getAllGeneros: getAllGeneros,
    getPelicula: getPelicula,
    getRecomendacion: getRecomendacion
}

/* paso 4*/