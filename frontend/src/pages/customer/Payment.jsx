import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { userAPI } from '../../services/api';
import { Button, Card } from '../../components/UI';
import './Payment.css';

const Payment = () => {
  const { isAuthenticated } = useAuth();
  const { getOrderData, resetOrder, address, selectedSabjis } = useOrder();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const orderData = getOrderData();

  if (!address || selectedSabjis.length < 2) {
    navigate('/meal-builder');
    return null;
  }

  if (!isAuthenticated) {
    navigate('/login', { state: { from: { pathname: '/payment' } } });
    return null;
  }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userAPI.placeOrder({
        ...orderData,
        paymentMethod
      });

      if (response.data) {
        navigate('/order-confirmation', {
          state: { orderId: response.data.orderId }
        });
        resetOrder();
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/checkout');
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <button onClick={handleBack} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Payment</h1>
          <p className="page-subtitle">Choose your payment method</p>
        </div>

        {error && (
          <div className="payment-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <div className="payment-content">
          <div className="payment-main">
            <Card className="payment-methods-card">
              <h2 className="card-title">Select Payment Method</h2>

              <div className="payment-methods">
                <button
                  className={`payment-method ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="payment-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div className="payment-details">
                    <h3 className="payment-name">Cash on Delivery</h3>
                    <p className="payment-description">Pay when you receive your order</p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="payment-check">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="payment-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div className="payment-details">
                    <h3 className="payment-name">UPI</h3>
                    <p className="payment-description">Pay using Google Pay, PhonePe, Paytm</p>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="payment-check">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="payment-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div className="payment-details">
                    <h3 className="payment-name">Debit / Credit Card</h3>
                    <p className="payment-description">Pay securely with your card</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="payment-check">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </Card>

            <Card className="delivery-address-card">
              <h2 className="card-title">Delivery Address</h2>
              <div className="address-display">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className="address-text">
                  <strong>{address.fullName}</strong>
                  <p>{address.street}</p>
                  {address.apartment && <p>{address.apartment}</p>}
                  {address.landmark && <p>Near {address.landmark}</p>}
                  <p>{address.city}, {address.pincode}</p>
                  <p>Phone: {address.phone}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="payment-sidebar">
            <Card className="order-summary-card">
              <h2 className="card-title">Order Summary</h2>

              <div className="order-items">
                <div className="order-item">
                  <span>Sabjis</span>
                  <span>{selectedSabjis.map(s => s.name).join(', ')}</span>
                </div>
                <div className="order-item">
                  <span>Base</span>
                  <span>{orderData.base === 'roti' ? '5 Rotis' : orderData.base === 'combo' ? '3 Rotis + Rice' : 'Rice Only'}</span>
                </div>
                {orderData.extraRoti > 0 && (
                  <div className="order-item">
                    <span>Extra Rotis</span>
                    <span>{orderData.extraRoti}</span>
                  </div>
                )}
                <div className="order-item">
                  <span>Quantity</span>
                  <span>{orderData.quantity} Thali{orderData.quantity > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-line">
                  <span>Subtotal</span>
                  <span>₹{orderData.pricing.subtotal}</span>
                </div>
                {orderData.pricing.discount > 0 && (
                  <div className="price-line discount">
                    <span>Discount</span>
                    <span>-₹{Math.round(orderData.pricing.discount)}</span>
                  </div>
                )}
                <div className="price-line">
                  <span>Tax</span>
                  <span>₹{Math.round(orderData.pricing.tax)}</span>
                </div>
                <div className="price-line">
                  <span>Delivery</span>
                  <span>₹{orderData.pricing.deliveryFee}</span>
                </div>
                <div className="price-line total">
                  <span>Total Amount</span>
                  <span>₹{orderData.totalPrice}</span>
                </div>
              </div>

              <Button
                className="btn-primary-customer"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Placing Order...' : `Pay ₹${orderData.totalPrice}`}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
