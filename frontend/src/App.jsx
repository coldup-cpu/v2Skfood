import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import PublishMenu from './pages/admin/PublishMenu';
import Home from './pages/customer/Home';
import Login from './pages/customer/Login';
import Signup from './pages/customer/Signup';
import MealBuilder from './pages/customer/MealBuilder';
import OrderSummary from './pages/customer/OrderSummary';
import Checkout from './pages/customer/Checkout';
import Payment from './pages/customer/Payment';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import MyOrders from './pages/customer/MyOrders';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="meal-builder" element={<MealBuilder />} />
          <Route path="order-summary" element={<OrderSummary />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="my-orders" element={<MyOrders />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="publish-menu" element={<PublishMenu />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
