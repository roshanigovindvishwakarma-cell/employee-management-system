const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    // In serverless, we don't always need to explicitly connect on startup
    // Prisma will lazy-connect on the first query.
    // However, if we do want to test the connection:
    await prisma.$connect();
    console.log("🚀 PostgreSQL Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // DO NOT process.exit(1) in a serverless environment!
  }
};

module.exports = { prisma, connectDB };
