const mysql = require("mysql2");


module.exports = ()=>{
    const con = mysql.createConnection({
        host: "mysql",
        user: "root",
        password: "123456",
        port: 3306,
    });

    con.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.stack);
            return;
        }
        console.log('Connected to MySQL as id', con.threadId);

        // Create database
        con.query('CREATE DATABASE IF NOT EXISTS products', (error) => {
            if (error) throw error;
            console.log('Database "products" created (if it did not exist)');

            // Switch to the created database
            con.query('USE products', (error) => {
                if (error) throw error;
                console.log('Using database "products"');

                // Create table
                con.query('CREATE TABLE IF NOT EXISTS phones (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, price FLOAT)', (error) => {
                    if (error) throw error;
                    console.log('Table "phones" created (if it did not exist)');

                    // Import data
                    const data = [
                        ['iphone 13', 44000],
                        ['iphone 12', 54000],
                        ['iphone 16', 65000]
                    ];

                    con.query('INSERT INTO phones (name, price) VALUES ?', [data], (error, results) => {
                        if (error) throw error;
                        console.log(`${results.affectedRows} rows inserted`);

                        // Delete data
                        con.query('DELETE FROM phones WHERE name = ?', ['iphone 13'], (error, results) => {
                            if (error) throw error;
                            console.log(`${results.affectedRows} rows deleted`);

                            // Update data
                            con.query('UPDATE phones SET name = ? WHERE name = ?', ['iphone 12 promax', 'iphone 12'], (error, results) => {
                                if (error) throw error;
                                console.log(`${results.affectedRows} rows updated`);
                            });
                        });
                    });
                });
            });
        });
    });
}
