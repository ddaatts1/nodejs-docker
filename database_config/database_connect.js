
const db_con = require("mysql2")


module.exports = ()=>{
   return  db_con.createConnection({
        host:"mysql",
        database:"products",
        user:"root",
        password:"123456"
    })
}
