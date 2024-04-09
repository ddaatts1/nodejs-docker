const init_db = require("./services/testdb")
const ScrapeServices = require("./services/scrape_services")
const product_db = require("./database_config/database_connect")
const express = require("express");
const ano_service = require("./services/AnoServices")
const schedule_task = require("./services/schedule_task")
const app = express();
const router = require("./router/router")

// const t = new ano_service()
// schedule_task()

app.use("/api",router)

const port = 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
