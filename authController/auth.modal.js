const connection = require("../sqlDb/sqlDb.js");

const AuthModel = {
    // MARK: - Register User
    async registerUser(user) {
        console.log(user)
       
        const sql = `INSERT INTO users 
            (first_name, last_name, state, district, city, address, email, mobile_number, category, password, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        try {
            const [result] = await connection.query(sql, [
                user.firstName, user.lastName, user.state, user.district, user.city, 
                user.address, user.email, user.mobileNumber, user.category, user.password, "USER"
            ]);
            console.log(result);
            return result;

        } catch (error) {
            console.error("🔥 Error in registerUser:", error.message);
            throw new Error("Database error while registering user");
        }
    },
    
    // MARK: - Check if Email Already Exists
    async isEmailExists(email) {
        const sql = "SELECT id FROM users WHERE email = ?"; 
        try {
            const [rows] = await connection.query(sql, [email]);
            return rows.length > 0; 
        } catch (error) {
            console.error("🔥 Error in isEmailExists:", error.message);
            throw new Error("Database error while checking email existence");
        }
    },

    // MARK: - Get User By Email
    async getUserByEmail(email) {
        const sql = "SELECT * FROM users WHERE email = ?";
        try {
            const [rows] = await connection.query(sql, [email]);
            return rows[0];
        } catch (error) {
            console.error("🔥 Error in getUserByEmail:", error.message);
            throw new Error("Database error while fetching user by email");
        }
    },

    // MARK: - Get User By Id
    async getUserById(id) {
        const sql = "SELECT * FROM users WHERE id = ?";
        try {
            const [rows] = await connection.query(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error("🔥 Error in getUserById:", error.message);
            throw new Error("Database error while fetching user by id");
        }
    },

    // MARK: - Update Password
    async updatePassword(userId, hashedPassword) {
        const sql = "UPDATE users SET password = ? WHERE id = ?";
        try {
            const [result] = await connection.query(sql, [hashedPassword, userId]);
            return result;
        } catch (error) {
            console.error("🔥 Error in updatePassword:", error.message);
            throw new Error("Database error while updating password");
        }
    },  


};

module.exports = AuthModel;
