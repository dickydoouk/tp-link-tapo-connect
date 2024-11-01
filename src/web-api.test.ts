import request from 'supertest';
import { app } from './web-api';

describe('Web API Endpoints', () => {
  const email = 'test@example.com';
  const password = 'password';
  const deviceIp = '192.168.0.1';

  it('should login to cloud', async () => {
    const response = await request(app)
      .post('/cloudLogin')
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  it('should list devices', async () => {
    const response = await request(app)
      .get('/listDevices')
      .query({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should login to device by IP', async () => {
    const response = await request(app)
      .post('/loginDeviceByIp')
      .send({ email, password, deviceIp });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Device login successful');
  });

  it('should discover local devices', async () => {
    const response = await request(app)
      .get('/discoverDevices')
      .query({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

export { app };
