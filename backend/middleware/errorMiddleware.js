function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const prismaCode = err && (err.code || (err.meta && err.meta.code));

  if (prismaCode === "P1000") {
    return res.status(500).json({
      message: "Database authentication failed. Check DATABASE_URL username/password in backend/.env"
    });
  }

  res.status(statusCode).json({
    message: err.message || "Server error"
  });
}

module.exports = { notFound, errorHandler };

