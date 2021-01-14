const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./bugrudo.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the bugrudo database.');
});

db.serialize(() => {
    console.log("Creating bugs table");
    db.run(`CREATE TABLE bugs (
        date TEXT,
        description TEXT
    );`)

    db.run(`INSERT INTO bugs (date, description) VALUES (datetime('now'), 'first bug')`)
    db.run(`INSERT INTO bugs (date, description) VALUES (datetime('now'), 'second bug')`)

    var query = `SELECT * FROM bugs ORDER BY date DESC`;
    db.all(query, [], (err, rows) => {
        if(err) {
            throw err;
        }
        var count = rows.length;
        console.log("count is: " + count)

        rows.forEach((row) => {
            console.log(row.description);
        });

    }); 

  });


db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });