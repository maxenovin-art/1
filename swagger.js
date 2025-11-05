import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "CRUD + Auth system using Next.js API routes and MongoDB",
    },
    servers: [
      { url: "http://localhost:3000/api" }
    ],
  },
  apis: ["./pages/api/**/*.js"], // path to your API files
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(4000, () => {
  console.log("Swagger UI available at http://localhost:4000/api/docs");
});
