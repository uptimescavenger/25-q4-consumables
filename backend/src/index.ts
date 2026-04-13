import express from "express";
import cors from "cors";
import path from "path";
import inventoryRoutes from "./routes/inventory";
import orderRoutes from "./routes/orders";
import automationRoutes from "./routes/automations";
import dashboardRoutes from "./routes/dashboard";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/automations", automationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve React frontend in production
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));

// SPA fallback — any non-API route serves index.html
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
