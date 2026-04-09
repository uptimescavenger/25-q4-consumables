import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventory";
import orderRoutes from "./routes/orders";
import automationRoutes from "./routes/automations";
import dashboardRoutes from "./routes/dashboard";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/automations", automationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
