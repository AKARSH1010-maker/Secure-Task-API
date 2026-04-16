const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Secure Task API",
    version: "1.0.0",
    description: "Role-based task management API with JWT authentication"
  },
  servers: [
    {
      url: "http://localhost:5000"
    }
  ],
  paths: {}
};

module.exports = swaggerSpec;