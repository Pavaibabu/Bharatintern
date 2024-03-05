const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const connect = mongoose.connect('mongodb://localhost:27017/Login');

connect.then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.error("Database connection error:", err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // Password should be hashed
    phno: String
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

// Create User model
const User = mongoose.model('User', userSchema);

app.post("/sign_up", async (req, res) => {
    try {
        const { name, email, password, phno } = req.body;
        if (!password) {
            console.error("Signed successfully");
            return res.status(400).send("Signed successfully");
        }
        const newUser = new User({ name, email, password, phno });
        await newUser.save();
        console.log("New user created:", newUser); 
        res.status(201).send("User created successfully");
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});
app.get("/sign_up", (req, res) => {
    res.render('sign_up');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server Running on port:${port}`);
});
