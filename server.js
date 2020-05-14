const dotenv = require('dotenv').config();
const graphQLHTTP = require('express-graphql');
const cors = require('cors');
const express = require('express');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use('/graphql', graphQLHTTP({
  schema,
  graphiql: true
}));

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`)
});