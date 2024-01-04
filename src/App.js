import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import { AuthProvider } from "./pages/authcontext";
import StationaryPage from './pages/StationaryPage';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Layout from './pages/Layout'; // Import the Layout component
import { UserProvider } from './pages/UserContext';
import {  CartProvider } from './pages/CartProvider'; // Import the CartProvider
import ProductDetail from './pages/ProductDetail';
import ContactUs from './pages/ContactUs';
import Earrings from './pages/Earrings';
import Pendants from './pages/Pendants';
import Keychains from './pages/Keychains';
import Cart from './pages/Cart';
import RazorpayTest from './Testing/RazorpayTest';
function App() {
  return (
    <Router>  
      <Layout>
        <UserProvider>
          <AuthProvider>
            <CartProvider> {/* Add CartProvider here */}
              <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route path="/stationary" element={<StationaryPage/>} />
                <Route path="/spcloffer" element={<Offers/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/contact" element={<ContactUs/>} />
                <Route path="/category/:categoryType/:productId" element={<ProductDetail />} />
                <Route path="/accessories/earrings" element={<Earrings />} />
                <Route path="/accessories/pendants" element={<Pendants />} />
                <Route path="/accessories/keychains" element={<Keychains />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/razorpay-test" element={<RazorpayTest/>} />
              </Routes>           
            </CartProvider>
          </AuthProvider> 
        </UserProvider>
      </Layout>     
    </Router>
  );
}

export default App;
