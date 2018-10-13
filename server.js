
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




router.get('/titles/:author', function (req, res) {
    pool.connect(function (errD, db, done) {
        if (errD) {
            console.log('Error connecting', errD);
            res.sendStatus(500);
        } else {

            // We just need to take the result of this query, and update each poem ID to have author_id of the relevant author:
            var queryText = `SELECT title FROM poems WHERE author_id=${req.params.author};`;

            db.query(queryText, function (errQ, result) {
                done(); // pool +1
                if (errQ) {
                    console.log('Error making query', errQ);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});


router.get('/poem/:id', function (req, res) {
    pool.connect(function (errD, db, done) {
        if (errD) {
            console.log('Error connecting', errD);
            res.sendStatus(500);
        } else {

            // We just need to take the result of this query, and update each poem ID to have author_id of the relevant author:
            var queryText = `SELECT * FROM lines WHERE poem_id=${req.params.id};`;

            db.query(queryText, function (errQ, result) {
                done(); // pool +1
                if (errQ) {
                    console.log('Error making query', errQ);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});



// ===================================== SETUP DATABASE =====================================

// Add author_id foreign keys to poems table:
router.get('/authors', function (req, res) {
    pool.connect(function (errD, db, done) {
        if (errD) {
            console.log('Error connecting', errD);
            res.sendStatus(500);
        } else {

            // We just need to take the result of this query, and update each poem ID to have author_id of the relevant author:
            var queryText = 'SELECT author, array_agg(id) as all_poems FROM poems GROUP BY author;';

            db.query(queryText, function (errQ, result) {
                done(); // pool +1
                if (errQ) {
                    console.log('Error making query', errQ);
                    res.sendStatus(500);
                } else {

                    let allIds = [];

                    result.rows.forEach(d => {
                        d.all_poems.forEach(id => {
                            allIds.push({
                                author_name: d.author,
                                poem_id: id
                            });
                        });
                    });


                    allIds.forEach(poem => {
                        queryText = 'SELECT id FROM authors WHERE name = $1';

                        db.query(queryText, [poem.author_name], (err, res) => {
                            // console.log(res.rows[0].id)
                            const author_id = res.rows[0].id;

                            queryText = 'UPDATE poems SET author_id = $1 WHERE id = $2;';

                            db.query(queryText, [author_id, poem.poem_id], (err2, res2) => {
                                if (err2) console.log(err2);
                            });
                        });
                    });

                    res.send(result.rows);
                }
            });
        }
    });
});


// Populate the author's table
router.get('/all_authors', function (req, res) {
    pool.connect(function (errD, db, done) {
        if (errD) {
            console.log('Error connecting', errD);
            res.sendStatus(500);
        } else {

            // We just need to take the result of this query, and update each poem ID to have author_id of the relevant author:
            var queryText = 'SELECT DISTINCT ON (author) author FROM poems;';

            db.query(queryText, function (errQ, result) {
                done(); // pool +1
                if (errQ) {
                    console.log('Error making query', errQ);
                    res.sendStatus(500);
                } else {

                    result.rows.forEach(author => {
                        queryText = 'INSERT INTO authors (name) VALUES ($1);';
                        db.query(queryText, [author.author], (err, res) => { if (err) console.log(err); });
                    });

                    res.send(result.rows);
                }
            });
        }
    });
});


app.listen(PORT, () => console.log(`thanks for listening on port ${PORT}`));