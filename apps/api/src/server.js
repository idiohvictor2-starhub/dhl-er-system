require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`ER case management API listening on port ${port}`);
});
