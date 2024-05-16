const dotenv = require('dotenv');
const result = dotenv.config({ path: '.release.env'});

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
module.exports = envs;