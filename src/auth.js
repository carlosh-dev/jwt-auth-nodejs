import jsonwebtoken from 'jsonwebtoken';

export const PRIVATE_KEY = 'secret';
export const user = {
  name: 'Carlos',
  email: 'email@example.com',
};

export function tokenValidated(req, res, next) {
  const [, token] = req.headers.authorization?.split(' ') || ['', ''];

  if (!token) return res.status(401).send('No token. Access denied!');

  try {
    const payload = jsonwebtoken.verify(token, PRIVATE_KEY);
    const userIdFromToken = typeof payload !== 'string' && payload.user;

    if (!user && !userIdFromToken) {
      return res.status(401).send('Invalid token!');
    }

    req.headers['user'] = payload.user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Invalid token!',
    });
  }
}
