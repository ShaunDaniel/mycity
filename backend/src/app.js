require('dotenv').config();
const express = require("express");

const db = require("./config/dbCon.js"); 
const app = express();
const port = 3001; 


    // Start the server
    app.listen(port, (req, res) => {
        console.log(`Server is running on port ${port}`);
    });
    
