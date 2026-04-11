const { prisma } = require("../config/prisma");

async function listEmployees() {
  return prisma.employee.findMany({ orderBy: { createdAt: "desc" } });
}

async function getEmployeeById(id) {
  return prisma.employee.findUnique({ where: { id } });
}

async function createEmployee(data) {
  return prisma.employee.create({ data });
}

async function updateEmployeeById(id, data) {
  return prisma.employee.update({ where: { id }, data });
}

async function deleteEmployeeById(id) {
  return prisma.employee.delete({ where: { id } });
}

async function getStats() {
  const [total, active] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: "ACTIVE" } })
  ]);

  return { totalEmployees: total, activeEmployees: active };
}

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
  getStats
};

