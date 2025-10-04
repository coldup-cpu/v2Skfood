import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { Button, Card, Badge } from '../../components/UI';
import './MyOrders.css';

const MyOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getOrderHistory();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      preparing: 'status-preparing',
      outForDelivery: 'status-delivery',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      outForDelivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="my-orders-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
        <h2>Please Login</h2>
        <p>You need to be logged in to view your orders</p>
        <Button as={Link} to="/login" className="btn-primary-customer">
          Login Now
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-error">
        <p>{error}</p>
        <Button onClick={fetchOrders}>Try Again</Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders. Start ordering now!</p>
        <Button as={Link} to="/meal-builder" className="btn-primary-customer">
          Order Now
        </Button>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <div className="my-orders-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">View and track all your orders</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <Card key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id-section">
                  <span className="order-id">Order #{order._id.slice(-8)}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <Badge className={`status-badge ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              <div className="order-items">
                <div className="order-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  <span>Sabjis: {order.sabjisSelected?.join(', ') || 'N/A'}</span>
                </div>
                <div className="order-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Base: {order.base === 'roti' ? '5 Rotis' : order.base === 'combo' ? '3 Rotis + Rice' : 'Rice Only'}</span>
                </div>
                {order.extraRoti > 0 && (
                  <div className="order-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span>Extra Rotis: {order.extraRoti}</span>
                  </div>
                )}
                <div className="order-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Quantity: {order.quantity} Thali{order.quantity > 1 ? 's' : ''}</span>
                </div>
              </div>

              {order.address && (
                <div className="order-address">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>
                    {order.address.street}, {order.address.city} - {order.address.pincode}
                  </span>
                </div>
              )}

              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount</span>
                  <span className="total-price">₹{order.totalPrice}</span>
                </div>
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button variant="secondary" size="sm">
                    Track Order
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
