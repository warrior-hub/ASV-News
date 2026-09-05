import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateNews from "./components/CreateNews";
import CategoryNews from "./pages/CategoryNews";
import NewsDetails from "./pages/NewsDetails";
import LatestNews from "./pages/LatestNews";
import AdminNews from "./pages/AdminNews";
import EditNews from "./pages/EditNews";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import AllEmployees from "./pages/AllEmployees";
import ShowEmployee from "./pages/ShowEmployee";
import About from "./pages/About";
import Search from "./pages/Search";
import Contact from "./pages/Contact";
import AdminContacts from "./pages/AdminContacts";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/employees/:id" element={<ShowEmployee />} />
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/category/:category" element={<CategoryNews />} />
      <Route path="/search" element={<Search />} />
      <Route path="/latest" element={<LatestNews />} />

      {/* Admin Login - Public */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/news/create" element={<CreateNews />} />
        <Route path="/admin/news/:id/edit" element={<EditNews />} />

        <Route path="/admin/employees" element={<AllEmployees />} />
        <Route path="/admin/employees/add" element={<AddEmployee />} />
        <Route
          path="/admin/employees/edit/:id"
          element={<EditEmployee />}
        />

        <Route path="/admin/contacts" element={<AdminContacts />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;