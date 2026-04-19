const jwtService = require('../services/jwt.service');
const userRepository = require('../repositories/user.repository');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');

    if (!token) {
      return res.status(401).json({ message: 'Missing bearer token.' });
    }

    const payload = jwtService.verifyToken(token);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'User session is invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requireAuth
};
