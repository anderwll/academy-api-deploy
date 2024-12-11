import "dotenv/config";
import express from "express";
import cors from "cors";

import swaggerUI from "swagger-ui-express";
import swaggerDoc from "./docs/swagger.json";
import { StudentRoutes, AuthRoutes } from "./routes";
import { AssessmentRoutes } from "./routes/assessment.routes";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUI.serve);
app.get("/docs", swaggerUI.setup(swaggerDoc));

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Api Academy",
  });
});

app.use(AuthRoutes.execute());
app.use(StudentRoutes.execute());
app.use(AssessmentRoutes.execute());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});
