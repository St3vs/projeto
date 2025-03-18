const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentation',
    description: 'Documentação da API usando Swagger',
  },
  host: 'localhost:4000', 
  schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./server.js']; 

swaggerAutogen(outputFile, endpointsFiles);
