export const environment = {
  production: true,
  port: process.env['PORT'] || 3000,
  database: {
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    username: process.env['DB_USERNAME'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'password',
    database: process.env['DB_NAME'] || 'hotel_reservation',
  },
  vipApi: {
    url: process.env['VIP_API_URL'] || 'https://api.example.com/vip/check',
    token: process.env['VIP_API_TOKEN'] || 'dummy-token',
  },
}; 