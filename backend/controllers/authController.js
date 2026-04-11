const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

function sanitizeUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

async function signup(req, res) {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashed, role });

  const token = signToken(user.id);
  res.status(201).json({ token, user: sanitizeUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user.id);
  res.json({ token, user: sanitizeUser(user) });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { signup, login, me };

