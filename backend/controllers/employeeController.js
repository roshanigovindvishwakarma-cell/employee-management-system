const employeeModel = require("../models/employeeModel");

async function listEmployees(req, res) {
  const employees = await employeeModel.listEmployees();
  res.json(employees);
}

async function getEmployee(req, res) {
  const employee = await employeeModel.getEmployeeById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
}

async function createEmployee(req, res) {
  const { firstName, lastName, email, phone, department, title, salary, status } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: "firstName, lastName, email are required" });
  }

  const employee = await employeeModel.createEmployee({
    firstName,
    lastName,
    email,
    phone: phone || null,
    department: department || null,
    title: title || null,
    salary: salary === 0 || salary ? Number(salary) : null,
    status: status || "ACTIVE"
  });

  res.status(201).json(employee);
}

async function updateEmployee(req, res) {
  const { firstName, lastName, email, phone, department, title, salary, status } = req.body;

  try {
    const employee = await employeeModel.updateEmployeeById(req.params.id, {
      ...(firstName !== undefined ? { firstName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(department !== undefined ? { department: department || null } : {}),
      ...(title !== undefined ? { title: title || null } : {}),
      ...(salary !== undefined ? { salary: salary === null ? null : Number(salary) } : {}),
      ...(status !== undefined ? { status } : {})
    });
    res.json(employee);
  } catch (err) {
    return res.status(404).json({ message: "Employee not found" });
  }
}

async function deleteEmployee(req, res) {
  try {
    await employeeModel.deleteEmployeeById(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(404).json({ message: "Employee not found" });
  }
}

async function stats(req, res) {
  res.json(await employeeModel.getStats());
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  stats
};

