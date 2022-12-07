const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');

const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

//run the server on a port specified in our .env file or port 4000 
const port = process.env.PORT || 4000;

const DB_HOST = process.env.DB_HOST;

// get the user info from a jwt
const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error('Session Invalid');
        }
    }
}


// let notes = [
//     { id: '1', content: 'This is a note', author: 'Adam Scott' },
//     { id: '2', content: 'This is another note', author: 'Harlow Everly' },
//     { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
// ]

// construct a graphQL schema

// provide resolver functions for our schema fields

db.connect(DB_HOST);

app.use(helmet());
app.use(cors());

// apollo server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
    	const token = req.headers.authorization;
    	const user = getUser(token);
    	console.log(user);
        return { models, user };
    }
});

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello World'));
app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));