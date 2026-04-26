// import  { createServer } from 'http';

// const server = createServer((req, res) => {
//     res.write('Hello ss');

//     return res.end();
// });

// server.listen(3333)

import Fastify from 'fastify';
import { PostgresDatabase } from './database.postgres.js';

const database = new PostgresDatabase();

// post http://localhost:3333/recipes
// get http://localhost:3333/
// put http://localhost:3333/recipes/1
// delete http://localhost:3333/recipes/1


const server = Fastify();

server.post('/recipes', async (req, res) => {
   const { title, description, tempoPreparo } = req.body

    await database.create({
        title,
        description,
        tempoPreparo
    })

    return res.status(201).send()
});

server.get('/recipes', async (req) => {

    const search = req.query.search
    
    const recipes = await database.list(search)

    return recipes
});

server.put('/recipes/:id', async (req, res) => {
    const recipeId = req.params.id
    const { title, description, tempoPreparo } = req.body

    await database.update(recipeId, {
        title,
        description,
        tempoPreparo
    })

    return res.status(204).send()
});

server.delete('/recipes/:id', async (req, res) => {
   const recipeId = req.params.id
   
   await database.delete(recipeId)

   return res.status(204).send()

});



server.listen({ 
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333 
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running on ${address}`);
});
