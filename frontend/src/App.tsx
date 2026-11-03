import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { EventsProvider } from "./context/EventsContext";
import SiteLayout from "./components/layout/SiteLayout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminPage from "./pages/AdminPage";
import AddEventPage from "./pages/AddEventPage";
import EditEventPage from "./pages/EditEventPage";
import NotFoundPage from "./pages/NotFoundPage";
export default function App() {
  return <BrowserRouter><EventsProvider><Routes><Route element={<SiteLayout/>}>
    <Route path="/" element={<HomePage/>}/><Route path="/events" element={<EventsPage/>}/><Route path="/events/:id" element={<EventDetailPage/>}/>
    <Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
    <Route path="/admin" element={<AdminPage/>}/><Route path="/admin/new" element={<AddEventPage/>}/><Route path="/admin/:id/edit" element={<EditEventPage/>}/><Route path="*" element={<NotFoundPage/>}/>
  </Route></Routes></EventsProvider></BrowserRouter>;
}
