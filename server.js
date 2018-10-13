
const express = require('express');
const app = express();
const PORT = 3030;

var router = express.Router();

var pg = require('pg');
var config = {
  database: 'poems_vocal',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

app.use(express.static('public'));
// app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router); // don't forget this...

router.get('/authors', function(req, res){
    pool.connect(function(errD, db, done) {
      if(errD) {
        console.log('Error connecting', errD);
        res.sendStatus(500);
      } else {  

        // We just need to take the result of this query, and update each poem ID to have author_id of the relevant author:
        var queryText = 'SELECT author, array_agg(id) as all_poems FROM poems GROUP BY author;';
       
        db.query(queryText, function(errQ, result){
          done(); // pool +1
          if(errQ) {
            console.log('Error making query', errQ);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  });


  router.get('/titles/:author', function(req, res){
    pool.connect(function(errD, db, done) {
      if(errD) {
        console.log('Error connecting', errD);
        res.sendStatus(500);
      } else {  

        // We just need to take the result of this query, and update each poem ID to have author_id of the relevant author:
        var queryText = `SELECT title FROM poems WHERE author_id=${req.params.author};`;
       
        db.query(queryText, function(errQ, result){
          done(); // pool +1
          if(errQ) {
            console.log('Error making query', errQ);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  });


  router.get('/poem/:id', function(req, res){
    pool.connect(function(errD, db, done) {
      if(errD) {
        console.log('Error connecting', errD);
        res.sendStatus(500);
      } else {  

        // We just need to take the result of this query, and update each poem ID to have author_id of the relevant author:
        var queryText = `SELECT * FROM lines WHERE poem_id=${req.params.id};`;
       
        db.query(queryText, function(errQ, result){
          done(); // pool +1
          if(errQ) {
            console.log('Error making query', errQ);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  });


app.listen(PORT, () => console.log(`thanks for listening on port ${PORT}`));