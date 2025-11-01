import app from './index.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running for local development at http://localhost:${port}`);
});
