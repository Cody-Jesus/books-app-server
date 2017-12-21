'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');

const app = express()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const CLIENT_URL = process.env.CLIENT_URL

const client = new pg.Client(DATABASE_URL)
client.connect()
client.on('error', console.error)

app.use(cors())

app.get('/api/v1/books', (req, res) => {
  client.query('SELECT * FROM books;')
    .then(results => res.send(results.rows))
    .catch(console.error)
})

app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=$1;`, [req.params.id])
  // console.log('your getting books by id')
    // .then(console.log(res))
    .then(result => res.send(result.rows))
    .catch(console.error);
});

app.all('*', (req, res) => res.redirect(CLIENT_URL))
app.listen(PORT, () => console.log(`Listening on ${PORT}`))