const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql
const _ = require('lodash')
const Movie = require('../models/movie')
const Director = require('../models/director')

// const movies = [
//   { name: 'Joker', genre: 'Drama', id: '1', directorId: '1' },
//   { name: 'Moonrise', genre: 'Romance', id: '2', directorId: '2' },
//   { name: 'La La Land', genre: 'Musical', id: '3', directorId: '3' },
//   { name: 'Interstellar', genre: 'Sci-Fi', id: '4', directorId: '4' },
//   {
//     name: 'The Grand Budapest Hotel',
//     genre: 'Comedy',
//     id: '4',
//     directorId: '2',
//   },
//   { name: 'Whiplash', genre: 'Drama', id: '4', directorId: '3' },
//   { name: 'First Man', genre: 'Biography', id: '4', directorId: '3' },
// ]

// const directors = [
//   { name: 'Todd Philips', age: 60, id: '1' },
//   { name: 'was Anderson', age: 55, id: '2' },
//   { name: 'Damien Chazelle', age: 33, id: '3' },
//   { name: 'Christopher Nolan', age: 97, id: '4' },
// ]

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        // return _.find(directors, { id: parent.directorId })
        return Director.findById(parent.directorId)
      },
    },
  }),
})

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return _.filter(movies, { directorId: parent.id })
        return Movie.find({ directorId: parent.id })
      },
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movie.findById(args.id)
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Director.findById(args.id)
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({})
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Director.find({})
      },
    },
  }),
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const director = new Director({
          name: args.name,
          age: args.age,
        })

        return director.save()
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const movie = new Movie({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        })

        return movie.save()
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
