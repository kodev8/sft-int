const app = require('./src/index');
const { PORT, DB_URI } = require('./src/config');

app.listen(PORT, () => console.log(`Server running on port ${PORT}; DB_URI: ${DB_URI}`));
