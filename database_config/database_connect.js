
const db_con = require("mysql2")


module.exports = ()=>{
   return  db_con.createConnection({
        host:process.env.MYSQL_HOST,
        database:process.env.MYSQL_DATABASE,
        user:process.env.MYSQL_USER,
        password:process.env.MYSQL_PASSWORD
    })
}


