import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";

// admin pages
import AddProduct from "./pages/admin/AddProduct";
import AdminSales from "./pages/admin/AdminSales";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrder from "./pages/admin/AdminOrder";
import ShowUserOrder from "./pages/admin/ShowUserOrder";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import OrderSuccess from "./pages/OrderSuccess";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />

        {/* PROFILE */}
        <Route
          path="/profile/:userId"
          element={
            <>
              <ProtectedRoute><Navbar />
              <Profile /></ProtectedRoute>
            </>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <>
            
              <Navbar />
              <Products />
            </>
          }
        />
 <Route
          path="/products/:id"
          element={
            <>
            
              <Navbar />
              
              <SingleProduct/>
            </>
          }
        />
        {/* CART */}
        <Route
          path="/cart"
          element={
            <>
             <ProtectedRoute>
               <Navbar />
              <Cart />
             </ProtectedRoute>
            </>
          }
        />

  <Route
          path="/address"
          element={
            <>
             <ProtectedRoute>
              <AddressForm />
             </ProtectedRoute>
            </>
          }
        />

  <Route
          path="/order-success"
          element={
            <>
             <ProtectedRoute>
              <OrderSuccess />
             </ProtectedRoute>
            </>
          }
        />

        {/* DASHBOARD (NESTED ROUTES) */}
        <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Navbar /><Dashboard /></ProtectedRoute>}>
          <Route path="sales" element={<AdminSales />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route
            path="users/orders/:userId"
            element={<ShowUserOrder />}
          />
            <Route
            path="users"
            element={<AdminUsers/>}
          />
            <Route
            path="users/:id"
            element={<UserInfo/>}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
