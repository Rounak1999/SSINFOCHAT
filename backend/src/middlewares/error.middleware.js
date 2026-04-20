function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired.' });
  }

  if (error.array) {
    return res.status(400).json({ message: 'Validation failed.', errors: error.array() });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({
    message: error.message || 'Internal server error.'
  });
}

module.exports = {
  errorHandler
};
