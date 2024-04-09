const cron = require('node-cron');
const ScrapeServices = require("./scrape_services");



module.exports = ()=>{

    cron.schedule('0 07 10 * * *', async () => {
        console.log('This will run at 9:05');

        try {
            const scrape = new ScrapeServices();

            // Call the first function
            const accessWebResult = await scrape.accessWeb();
            console.log("========> ahihihi");

            await scrape.accessWeb2()
            // Call the second function
            const nextPageResult = await scrape.nextPage();
            // Do something with nextPageResult...
        } catch (error) {
            console.error("Error:", error);
        }
    }, {
        timezone: 'Asia/Bangkok'
    });

    // cron.schedule('*/3 * * * * *', () => {
    //     console.log('This will run every 3 seconds');
    // });
}

