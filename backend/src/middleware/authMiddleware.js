jwt = require('jsonwebtoken');
const User = require('../models/User');


async function auth(req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ error: 'No token' });
}