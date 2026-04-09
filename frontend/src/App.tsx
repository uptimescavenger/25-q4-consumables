import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-grey-50">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/consumables" element={<InventoryPage />} />
          <Route path="/consumables/catalog" element={<InventoryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
