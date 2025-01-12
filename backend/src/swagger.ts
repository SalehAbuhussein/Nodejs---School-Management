import { Application } from 'express';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management API',
      description: "API endpoints for a School Management Services documented on swagger",
      contact: {
        name: "Saleh Abuhussein",
        email: "salehabuhussein2@gmail.com",
        url: "https://github.com/SalehAbuhussein/Nodejs---School-Management"
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:80/",
        description: "Local server"
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    console.log(swaggerSpec);
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  })
}
export default swaggerDocs;