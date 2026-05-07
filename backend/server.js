const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const bcrypt = require("bcryptjs");
const { prisma, connectDB } = require("./config/prisma");

async function seedData() {
  try {
    const employeeCount = await prisma.employee.count();
    if (employeeCount === 0) {
      console.log("🌱 Seeding demo employees...");
      await prisma.employee.createMany({
        data: [
          { firstName: "Roshni", lastName: "Vishwakarma", email: "roshni@example.com", department: "Engineering", title: "Lead Developer", salary: 150000, status: "ACTIVE" },
          { firstName: "Rajesh", lastName: "Kumar", email: "rajesh@example.com", department: "Marketing", title: "Manager", salary: 95000, status: "ACTIVE" },
          { firstName: "Anita", lastName: "Sharma", email: "anita@example.com", department: "HR", title: "Specialist", salary: 80000, status: "ACTIVE" },
          { firstName: "Vikram", lastName: "Singh", email: "vikram@example.com", department: "Engineering", title: "QA Engineer", salary: 70000, status: "ON_LEAVE" },
          { firstName: "Sunita", lastName: "Gupta", email: "sunita@example.com", department: "Sales", title: "Representative", salary: 65000, status: "ACTIVE" },
        ]
      });
    }

    console.log("🌱 Ensuring admin user exists...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "admin@ems.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@ems.com",
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    console.log("✅ Admin user ready.");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  }
}


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center;">
      <h1>🚀 Employee Management API</h1>
      <p>The backend is up and running.</p>
      <a href="/health" style="color: #0f766e; font-weight: bold;">Check System Health</a>
    </div>
  `);
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedData();
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});

module.exports = app;