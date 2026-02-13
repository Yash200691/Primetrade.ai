import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerDocs = () => {
  const spec = swaggerJSDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "PrimeTrade API",
        version: "1.0.0"
      },
      servers: [{ url: "/" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ["./src/routes/*.js"]
  });

  return [swaggerUi.serve, swaggerUi.setup(spec)];
};
