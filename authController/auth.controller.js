
// third part imports
const  jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// project imports 
const AuthModel = require("./auth.modal");
const sendResetEmail = require("../utils/email-utility.js"); 

const AuthController = {

    // MARK: - Register User
    async registerUser(req, res) {
        try {
            const { firstName, lastName, state, district, city, address, email, mobileNumber, category, password } = req.body;
            if (!firstName || !lastName || !state || !district || !city || !address || !email || !mobileNumber || !category || !password) {
                return res.status(200).json({ status: false, message: "All fields are required", data: null });
            }

            // here iam goin to check if email already exists
            const isEmailExists = await AuthModel.isEmailExists(email);
            if (isEmailExists) return res.status(200).json({ status: false, message: "Email already exists", data: null });
            
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await AuthModel.registerUser({ 
                firstName, lastName, state, district, city, address, email, mobileNumber, category, password: hashedPassword 
            });

            const token = jwt.sign({ id: user.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
            return res.status(201).json({ status: true, message: "User registered successfully", data: { token } });

        } catch (error) {
            console.error("Error in registerUser:", error);
            res.status(200).json({ status: false, message: "Internal Server Error", data: null });
        }
    },

    //MARK:- Login User
   async loginUser(req, res) {
    try {
        const { email, password } = req.body;    
        if (!email || !password) {
            return res.status(400).json({ status: false, message: "All fields are required", data: null });
        }
        
        const user = await AuthModel.getUserByEmail(email);
        if (!user) {
            return res.status(200).json({ status: false, message: "User not found", data: null });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {
            return res.status(200).json({ status: false, message: "Invalid credentials", data: null }); 
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: false,  
            sameSite: "strict", 
            maxAge: 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({ status: true, message: "Login successful", data: { token } });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", data: null });
    }
   },

    //MARK:- forgot password
   async forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(200).json({ status: false, message: "Email is required", data: null });
        
        const user = await AuthModel.getUserByEmail(email);
        if (!user) return res.status(200).json({ status: false, message: "User not found", data: null });
        
        // if user is there then send reset password link
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "5m" });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await sendResetEmail(email, resetLink);

        return res.status(200).json({ status: true, message: "Password reset link sent to your email" });

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", data: null });
    }
   },

    //MARK:- reset password  
    async  resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            
            if (!token || !newPassword) {
                return res.status(200).json({ status: false, message: "All fields are required", data: null });
            }
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            } catch (error) {
                return res.status(200).json({ status: false, message: "Invalid or expired token", data: null });
            }
    
            const user = await AuthModel.getUserById(decodedToken.id);
            if (!user) {
                return res.status(200).json({ status: false, message: "User not found", data: null });
            }
    
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            // Update user password
            await AuthModel.updatePassword(user.id, hashedPassword);
    
            return res.status(200).json({ status: true, message: "Password reset successful" });
    
        } catch (error) {
            console.error("Error in resetPassword:", error);
            return res.status(200).json({ status: false, message: "Internal Server Error", data: null });
        }
    },



};

module.exports = AuthController;