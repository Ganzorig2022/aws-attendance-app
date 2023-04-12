const { verifyToken } = require('./utils/verifyToken');

console.log(
  verifyToken(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzYjNlYzI3LWE1NTUtNDE1OS04NWMwLTliNjkzM2E0MGExMyIsImlhdCI6MTY4MTMwMjc0OCwiZXhwIjoxNjgxMzg5MTQ4fQ.R7O9kyizIcGe5GRGTCzmrgrA8MTvnNi7qz8y-jqMXMk'
  )
);
