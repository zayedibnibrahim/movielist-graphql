const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

CONNECTION_URL =
  'mongodb+srv://atoz-movie-zayed:zayed_3996@cluster0.6gnbd.mongodb.net/atoz-movie?retryWrites=true&w=majority'
mongoose.connect(CONNECTION_URL)
mongoose.connection.once('open', () => {
  console.log('Connection with database successfully')
})

const app = express()
app.use(cors())
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(5000, () => {
  console.log('Server is running')
})
