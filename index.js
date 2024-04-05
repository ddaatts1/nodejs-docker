const init_db = require("./services/testdb")
const ScrapeServices = require("./services/scrape_services")
const product_db = require("./database_config/database_connect")
const express = require("express");
const schedule_task = require("./services/schedule_task")
const app = express();


const data = [
    ['iphone 10', 464000]
];
// product_db().query('INSERT INTO phones (name, price) VALUES ?', [data], (error, results) => {
//     if (error) throw error;
//     console.log(`${results.affectedRows} rows inserted`);
// })

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Node.js</h1>");
});

app.get("/", (req, res) => {
    // Execute the SELECT * query
    product_db().query('SELECT * FROM phones', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.code });
            return;
        }

        // Send the results as JSON
        res.json(results);
    });

});


app.get("/wipo", async (req, res) => {
    try {
        const scrape = new ScrapeServices();

        // Call the first function
        const accessWebResult = await scrape.accessWeb();
        console.log("========> ahihihi");
        res.send(accessWebResult);

        await scrape.accessWeb2()
        // Call the second function
        const nextPageResult = await scrape.nextPage();
        // Do something with nextPageResult...
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

const port = 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
