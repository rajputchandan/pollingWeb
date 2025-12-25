import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Ragister";
import Dashboard from "./pages/Dashbord";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventsDetails";
import Notifications from "./pages/Notification";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ROUTES (NO SIDEBAR) ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= APP ROUTES (WITH SIDEBAR) ================= */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/create-event"
          element={
            <MainLayout>
              <CreateEvent />
            </MainLayout>
          }
        />

        <Route
          path="/event/:id"
          element={
            <MainLayout>
              <EventDetails />
            </MainLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <MainLayout>
              <Notifications />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
