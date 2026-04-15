const express = require('express');

const cors = require('cors');
const port = 8000;
require('dotenv').config();
const app = express();
require('./db');
const jwt = require('jsonwebtoken');
const User = require('./MODELS/UserSchema');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

app.post('/register', async (req, res) => {
    try {
        const { password, email, age, gender, name } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                messsage: 'Email alredy existed'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hasedpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            password: hasedpassword,
            email,
            age,
            gender
        });
        await newUser.save();
        res.status(201).json(
            {
                message: "user registered succesfully"
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message: error
            }
        )
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json(
                {
                    message: 'Invalid credentials'
                }
            );
        }
        const isPasswordCorrect = await bcrypt.compare(
            password, existingUser.password
        );
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'invalid credentials'
            });
        }
        const token = jwt.sign({
            id: existingUser._id
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({
            token,
            message: 'user logged in'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});



function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    const { id } = req.body;

    if (!token) {
        return res.status(401).json({
            message: 'Auth Error'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (id && decoded.id !== id) {
            return res.status(401).json({
                message: 'auth errrorr'
            });

        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'invalid token'
        })
    }
}

app.post('/getmyprofile', authenticateToken, async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);
    res.status(200).json(
        {
            user
        }
    )
})

app.listen(port, () => {
    console.log('server start');
})