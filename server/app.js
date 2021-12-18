const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(process.env.CONNECTION_URL)
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
