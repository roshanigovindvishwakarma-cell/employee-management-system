const { prisma } = require("../config/prisma");

async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findUserSafeById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, name: true }
  });
}

async function createUser({ name, email, password, role }) {
  return prisma.user.create({
    data: {
      name: name || null,
      email,
      password,
      role: role === "ADMIN" ? "ADMIN" : "USER"
    }
  });
}

module.exports = { findUserByEmail, findUserSafeById, createUser };

