const request = require('supertest');
const app = require('./server');

describe('Server', () => {
  it('should return a response from the /users endpoint', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should create a new user using the /signup endpoint', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        email: 'testuser@test.com',
        username: 'testuser',
        password: 'testuser',
      });

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe('User created successfully');
  });

  it('should log in a user using the /login endpoint', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testuser',
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
  });
});
