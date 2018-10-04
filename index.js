/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
var sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

// Initialise postgres client
const config = {
  user: 'taras',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

if (config.user === 'ck') {
	throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

 const getRoot = (request, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon;';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon/home', {pokemon: result.rows} );
    }
  });
}

const getNew = (request, response) => {
  response.render('pokemon/new');
}

const getPokemon = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon/pokemon', {pokemon: result.rows[0]} );
    }
  });
}

const postPokemon = (request, response) => {
  let params = request.body;

  const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2);';
  const values = [params.name, params.height];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};

const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon/edit', {pokemon: result.rows[0]} );
    }
  });
}

const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}

const deletePokemonForm = (request, response) => {
  response.send("COMPLETE ME");
}

const deletePokemon = (request, response) => {
  response.send("COMPLETE ME");
}
/**
 * ===================================
 * User
 * ===================================
 */

const catchPokemon = (request, response) => {
   response.render('UsersPokemons/catchNewPokemon');
}

const addCatchedPokemon = (request, response) => {
   const text = 'UPDATE user_pokemons SET pokemon_id = $1  WHERE id= $2';
   const values = [request.body.pokemon_id, request.body.user_id ];

    pool.query(text, values, (err, result) => {
        if (err) {
        response.send('wtf');
        } else {
      response.send("pokemon added to user");
        }
    })
};

const showUsers = (request, response) => {

  const text = 'SELECT pokemon.id, pokemon.name FROM pokemon INNER JOIN user_pokemons ON user_pokemons.pokemon_id = pokemon.id WHERE user_pokemons.id = '+request.params.id+'';
  pool.query(text, (err, result) => {
    if (err) {
      console.error('wtf');
    } else {
      response.render('users/users_poks', {pokemon: result.rows});
    }
  });
};

const login = (request, response) => {
    response.render('users/login')
}

const userNew = (request, response) => {
  response.render('users/new');
}

const showCreatedUser = (request, response) => {

  const queryString = 'INSERT INTO user_pokemons ( user_name, user_password ) VALUES ($1, $2)';

  var hashedValue = sha256(request.body.user_password);

  const values = [request.body.user_name, hashedValue];

  pool.query(queryString, values, (err, result) => {

    if (err) {
      response.send('wtf');

    } else {

      console.log('Query result:', result);

      // redirect to home page
      response.send('New user has been created:' +request.body.user_name);
    }
  })
};

     const  loginPost = (request, response) => {

            let sqlText = "SELECT * FROM user_pokemons WHERE user_name='"+request.body.user_name+"'";

            pool.query(sqlText, (error, queryResult) => {
              if (error){
                console.log('error!', error);
                response.status(500).send('DIDNT WORKS!!');
              }else{

                const user = queryResult.rows[0];
                console.log( user.user_name );

                var hashedValue = sha256(request.body.user_password);
               // console.log(user.user_password);
               // console.log(user.user_name )
               // console.log("input: ", hashedValue );
                if( user.user_password === hashedValue &&  user.user_name === request.body.user_name ){

                   // response.cookie('loggedin', 'true');
                    response.cookie('loggedin', true);
                    response.send(request.body.user_name + ' successfully login');

                }else{

                    response.send('wtf');

                }
              }
            })
        };


/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get ('/users/catchPokemon', catchPokemon);
app.post ('/users/addPokemonSuccess', addCatchedPokemon);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// EVERYTHING ABOUT USERS, LOGINS and INTERACTION USERS WITH POKEMONS (catch Pokemon)
app.get ('/users/catchPokemon', catchPokemon);
app.post ('/users/addPokemonSuccess', addCatchedPokemon);

app.get('/users/new', userNew);
app.post('/users', showCreatedUser);

app.get('/users/:id', showUsers);

app.get('/login', login)
app.post('/login', loginPost)


// routes for users_pokemons


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


