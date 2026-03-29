import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
      description: "API for managing contacts",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
              description: "Unique identifier",
            },
            name: {
              type: "string",
              example: "Person Unknow",
            },
            phone: {
              type: "string",
              example: "+5491123456789",
            },
            email: {
              type: "string",
              example: "person@hotmail.com",
            },
          },
          required: ["name", "phone"],
        },
      },
    },
  },
  apis: [
    "./src/infrastructure/src/web/controllers/**/*.ts",
    "./src/infrastructure/src/web/routers/**/*.ts",
  ],
});
