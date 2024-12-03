import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { PRIVATE_KEY, tokenValidated, user } from './auth.js';

const api = express();
api.use(express.json());

api.get('/', (_, res) =>
  res.status(200).json({
    message: 'This is a public router!',
  })
);

api.get('/login', (req, res) => {
  const [, hash] = req.headers.authorization?.split(' ') || ['', ''];
  const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

  console.log('credentials', email, password);

  try {
    const correctCredentials =
      email === 'email@example.com' && password === '1234';

    if (!correctCredentials)
      return res.status(401).send('Email or password incorrect.');

    const token = jsonwebtoken.sign(
      { user: JSON.stringify(user) },
      PRIVATE_KEY,
      { expiresIn: '60m' }
    );

    return res.status(200).json({ data: { user, token } });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

api.use('*', tokenValidated);

api.get('/private', (req, res) => {
  const { user } = req.headers;
  const currentUser = JSON.parse(user);

  return res.status(200).json({
    message: 'This is a private router!',
    data: {
      userLogged: currentUser,
    },
  });
});

api.listen(3333, () => console.log('Server running on localhost:3333'));
