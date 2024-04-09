const ScrapeServices = require("../services/scrape_services");



exports.index = (req, res) => {
    res.send("<p>Do Tien Dat </p>");
};

exports.getDetails =(req, res)=>{
    console.log("Request URL:", req.url);
    console.log("Request Method:", req.method);
    console.log("Request Params:", req.params);
    console.log("Request Query:", req.query);
    console.log("Request Body:", req.body);
    res.send(`<p>details</p>`)
}


exports.wipo = async (req,res) =>{
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
}

