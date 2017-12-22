'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});


const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

bodyParser.urlencoded( {extended: false} )

app.get('/api/v1/books', (req, res) => {
  client.query('select book_id, title, author, image_url from books;')
  .then(results => res.send(results.rows))
  .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  client.query('select * from books where book_id=$1', [req.params.id])
  .then(results => res.send(results.rows))
  .catch(console.log);
});

app.post('/api/v1/books', bodyParser, (req, res) => {
  client.query(
    'insert into books(title, author, isbn, image_url, description) values($1, $2, $3, $4, $5)',
    [req.body.title, req.body.author, req.body.isbn, req.body.image_url, req.body.description]
  )
  .then(result => res.send('insertion complete'));
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

