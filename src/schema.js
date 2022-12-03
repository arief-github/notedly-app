const { gql } = require('apollo-server-express');

module.exports = gql `
	scalar DateTime

	type Note {
		id: ID!
		content: String!
		author: String!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type Query {
		notes: [Note!]!,
		note(id: ID!): Note!
	}

	type Mutation {
		newNote(content: String!, author: String!): Note
	}
`;