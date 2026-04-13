import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrdersPage";
import AutomationsPage from "./pages/AutomationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-grey-50">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/automations" element={<AutomationsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
