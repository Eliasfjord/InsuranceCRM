const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Use esm to load ES module routes
const esmRequire = require('esm')(module);
const serverRoutes = esmRequire('../routes/serverRoutes').default;

// Mock Users controller so login always succeeds
jest.mock('../controllers/users', () => ({
  __esModule: true,
  default: {
    index: jest.fn((req, res) => res.end()),
    view: jest.fn((req, res) => res.end()),
    edit: jest.fn((req, res) => res.end()),
    deleteData: jest.fn((req, res) => res.end()),
    register: jest.fn((req, res) => res.end()),
    login: jest.fn((req, res) => res.status(200).json({ message: 'ok' }))
  }
}));

// Setup express app using existing routes
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', serverRoutes);

describe('POST /user/login', () => {
  it('responds with 200', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({ emailAddress: 'test@example.com', password: 'pass' });
    expect(response.statusCode).toBe(200);
  });
});
