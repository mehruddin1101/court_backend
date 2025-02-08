const express = require('express');
const app = express();
const cors = require('cors');

// MARK: - MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MARK: - Auth ROUTES
app.use("/api/v1/auth", require("./authController/auth.route.js"));


app.listen(3000, () => {
    console.log('Listening to port 3000');  
});
