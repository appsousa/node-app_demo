import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppStateProvider } from "./contexts/AppStateContext";
import { AIAssistantProvider } from "./contexts/AIAssistantContext";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
// Importe o assistente simplificado em vez do original
import SimpleAIAssistant from "./components/SimpleAIAssistant";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Notifications from "./components/Layout/Notifications";
import EmergencyNavigation from "./components/EmergencyNavigation";
import "./App.css";

function App() {
  return (
    <AppStateProvider>
      <AIAssistantProvider>
        <Router>
          <div className="app">
            <Header />
            <EmergencyNavigation />
            <div className="main-container">
              <Sidebar />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
            </div>
            {/* Use o assistente simplificado aqui */}
            <SimpleAIAssistant />
            <Notifications />
          </div>
        </Router>
      </AIAssistantProvider>
    </AppStateProvider>
  );
}

export default App;
