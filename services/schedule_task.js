const cron = require('node-cron');



module.exports = ()=>{
    cron.schedule('*/2 * * * * *', () => {
        console.log('This will run every 2 seconds');
    });
}

