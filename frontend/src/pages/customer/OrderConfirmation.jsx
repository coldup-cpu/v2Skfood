import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/UI';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <Card className="confirmation-card">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="confirmation-title">Order Confirmed!</h1>
          <p className="confirmation-subtitle">
            Your delicious thali is being prepared
          </p>

          <div className="order-id-box">
            <span className="order-id-label">Order ID</span>
            <span className="order-id-value">#{orderId}</span>
          </div>

          <div className="timeline">
            <div className="timeline-item active">
              <div className="timeline-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="timeline-content">
                <h3>Order Confirmed</h3>
                <p>Your order has been received</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="timeline-content">
                <h3>Preparing</h3>
                <p>Fresh ingredients, made with love</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div className="timeline-content">
                <h3>Out for Delivery</h3>
                <p>On the way to your doorstep</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div className="timeline-content">
                <h3>Delivered</h3>
                <p>Enjoy your meal!</p>
              </div>
            </div>
          </div>

          <div className="delivery-estimate">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div>
              <strong>Estimated Delivery Time</strong>
              <p>30-40 minutes</p>
            </div>
          </div>

          <div className="confirmation-actions">
            <Button
              as={Link}
              to="/my-orders"
              className="btn-primary-customer"
              size="lg"
            >
              View Order Status
            </Button>
            <Button
              as={Link}
              to="/"
              variant="secondary"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </Card>

        <div className="support-info">
          <h3>Need Help?</h3>
          <p>If you have any questions about your order, feel free to contact us.</p>
          <div className="support-links">
            <a href="tel:+919876543210" className="support-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call Support
            </a>
            <a href="mailto:support@skfood.com" className="support-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
