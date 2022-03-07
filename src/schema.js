const { gql } = require('apollo-server')
const { prisma } = require('./db')

const typeDefs = gql`
  type Post {
    content: String
    id: ID!
    published: Boolean!
    title: String!
  }

  type Query {
    feed: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createDraft(content: String, title: String!): Post!
    publish(id: ID!): Post
  }
`

// const posts = [
//   {
//     id: 1,
//     title: 'Subscribe to GraphQL Weekly for community news ',
//     content: 'https://graphqlweekly.com/',
//     published: true,
//   },
//   {
//     id: 2,
//     title: 'Follow DigitalOcean on Twitter',
//     content: 'https://twitter.com/digitalocean',
//     published: true,
//   },
//   {
//     id: 3,
//     title: 'What is GraphQL?',
//     content: 'GraphQL is a query language for APIs',
//     published: false,
//   },
// ]

const resolvers = {
  Query: {
    feed: (parent, args) => {
      return prisma.post.findMany({
        where: { published: true },
      })
    },
    post: (parent, args) => {
      return prisma.post.findOne({
        where: { id: Number(args.id) },
      })
    },
  },
  Mutation: {
    createDraft: (parent, args) => {
      return prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
        },
      })
    },
    publish: (parent, args) => {
      return prisma.post.update({
        where: {
          id: Number(args.id),
        },
        data: {
          published: true,
        },
      })
    },
  },
  Post: {
    content: (parent) => parent.content,
    id: (parent) => parent.id,
    published: (parent) => parent.published,
    title: (parent) => parent.title,
  },
}


module.exports = {
  resolvers,
  typeDefs,
}
