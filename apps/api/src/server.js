require('dotenv').config();
const app = require('./app');

const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`ER case management API listening on http://${host}:${port}`);
});
