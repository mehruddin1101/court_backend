const connection = require("./sqlDb/sqlDb.js")

// MARK : - AUTH MODEL
const AuthModel = {
    // MARK : - REGISTER USER
    async registerUser(user){

        const sql =`INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`
        
        return await connection.query(sql)

    }
   
}

module.exports = AuthModel