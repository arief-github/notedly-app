const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
require('dotenv').config();

const db = require('./db');
const models = require('./models');

//run the server on a port specified in our .env file or port 4000 
const port = process.env.PORT || 4000;

const DB_HOST = process.env.DB_HOST;

let notes = [
    { id: '1', content: 'This is a note', author: 'Adam Scott' },
    { id: '2', content: 'This is another note', author: 'Harlow Everly' },
    { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
]

// construct a graphQL schema
const typeDefs = gql `
	type Note {
		id: ID!
		content: String!
		author: String!
	}

	type Query {
		hello: String,
		notes: [Note!]!,
		note(id: ID!): Note!
	}

	type Mutation {
		newNote(content: String!, author: String!): Note!
	}
`;

// provide resolver functions for our schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello World!',
        notes: () => async () => {
        	return await models.Note.find();
        },
        note: async (parent, args) => {
        	return await models.Note.findById(args.id);
        }
    },
    Mutation: {
    	newNote: async (parent, args) => {
    		return await models.Note.create({
    			content: args.content,
    			author: args.author
    		})
    	}
    }
};

db.connect(DB_HOST);

// apollo server setup
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello World'));
app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));