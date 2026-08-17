const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Notes app ready at http://localhost:${port}`));
