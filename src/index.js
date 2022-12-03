const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const app = express();
require('dotenv').config();

const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

//run the server on a port specified in our .env file or port 4000 
const port = process.env.PORT || 4000;

const DB_HOST = process.env.DB_HOST;

// let notes = [
//     { id: '1', content: 'This is a note', author: 'Adam Scott' },
//     { id: '2', content: 'This is another note', author: 'Harlow Everly' },
//     { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
// ]

// construct a graphQL schema

// provide resolver functions for our schema fields

db.connect(DB_HOST);

// apollo server setup
const server = new ApolloServer({ 
	typeDefs, 
	resolvers,
	context: () => {
		return { models };
	}
});

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello World'));
app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));