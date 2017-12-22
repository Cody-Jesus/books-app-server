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

bodyParser.urlencoded( {extended: false} )

app.get('/api/v1/books', (req, res) => {
  client.query('SELECT * FROM books;')
    .then(results => res.send(results.rows))
    .catch(console.error)
})

app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=$1;`, [req.params.id])
    .then(result => res.send(result.rows))
    .catch(console.error);
});

app.post('/api/v1/books', (request, response) => {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE
  client.query(
    `INSERT INTO
    books (title, author, image_url, isbn, description)
    VALUES ($1, $2, $3, $4, $5);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.image_url,
      request.body.isbn,
      request.body.description
    ]
  )
    .then(function() {
      response.send('insert complete')
    })
    .catch(function(err) {
      console.error(err);
    });
});



app.all('*', (req, res) => res.redirect(CLIENT_URL))
app.listen(PORT, () => console.log(`Listening on ${PORT}`))