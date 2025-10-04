import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { Button, Card } from '../../components/UI';
import './OrderSummary.css';

const OrderSummary = () => {
  const {
    selectedSabjis,
    selectedBase,
    extraRoti,
    quantity,
    updateQuantity,
    calculatePrice,
    goToStep
  } = useOrder();
  const navigate = useNavigate();

  const pricing = calculatePrice();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleBack = () => {
    navigate('/meal-builder');
  };

  if (selectedSabjis.length < 2) {
    return (
      <div className="order-summary-error">
        <p>Please select 2 sabjis first</p>
        <Button onClick={() => navigate('/meal-builder')}>
          Go to Meal Builder
        </Button>
      </div>
    );
  }

  const getBaseLabel = () => {
    if (selectedBase === 'roti') return '5 Rotis';
    if (selectedBase === 'combo') return '3 Rotis + Rice';
    return 'Rice Only';
  };

  return (
    <div className="order-summary-page">
      <div className="order-summary-container">
        <div className="order-summary-header">
          <button onClick={handleBack} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Order Summary</h1>
          <p className="page-subtitle">Review your thali before checkout</p>
        </div>

        <div className="summary-content">
          <div className="summary-main">
            <Card className="order-details-card">
              <h2 className="card-title">Your Thali</h2>

              <div className="order-section">
                <h3 className="section-label">Selected Sabjis</h3>
                <div className="sabjis-list">
                  {selectedSabjis.map((sabji, index) => (
                    <div key={index} className="sabji-item">
                      <div className="sabji-item-image">
                        <img
                          src={sabji.imageUrl || 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'}
                          alt={sabji.name}
                        />
                      </div>
                      <div className="sabji-item-details">
                        <h4 className="sabji-item-name">{sabji.name}</h4>
                        {sabji.isSpecial && (
                          <span className="sabji-special-tag">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Special +₹20
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-section">
                <h3 className="section-label">Base</h3>
                <div className="base-info">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  <span>{getBaseLabel()}</span>
                </div>
              </div>

              {extraRoti > 0 && (
                <div className="order-section">
                  <h3 className="section-label">Extra Rotis</h3>
                  <div className="base-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span>{extraRoti} Extra Rotis (₹{extraRoti * 5})</span>
                  </div>
                </div>
              )}

              <div className="order-section">
                <h3 className="section-label">Quantity</h3>
                <div className="quantity-control">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity === 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <div className="quantity-display">
                    <span className="quantity-value">{quantity}</span>
                    <span className="quantity-label">Thali{quantity > 1 ? 's' : ''}</span>
                  </div>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity === 5}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
                {quantity >= 3 && (
                  <div className="discount-notice">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    You're getting 5% bulk discount!
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/meal-builder')}
                className="edit-order-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Order
              </button>
            </Card>
          </div>

          <div className="summary-sidebar">
            <Card className="price-breakdown-card">
              <h2 className="card-title">Price Breakdown</h2>

              <div className="price-lines">
                <div className="price-line">
                  <span>Price per Thali</span>
                  <span>₹{pricing.perThaliPrice}</span>
                </div>
                <div className="price-line">
                  <span>Quantity</span>
                  <span>× {quantity}</span>
                </div>
                <div className="price-line subtotal">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="price-line discount">
                    <span>Bulk Discount (5%)</span>
                    <span>-₹{Math.round(pricing.discount)}</span>
                  </div>
                )}

                <div className="price-line">
                  <span>Tax (5%)</span>
                  <span>₹{Math.round(pricing.tax)}</span>
                </div>

                <div className="price-line">
                  <span>Delivery Fee</span>
                  <span>₹{pricing.deliveryFee}</span>
                </div>

                <div className="price-line total">
                  <span>Total</span>
                  <span>₹{pricing.total}</span>
                </div>
              </div>

              <Button
                className="btn-primary-customer"
                size="lg"
                onClick={handleCheckout}
                style={{ width: '100%' }}
              >
                Proceed to Checkout
              </Button>
            </Card>

            <div className="delivery-info">
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>
                  <strong>Delivery Time</strong>
                  <p>30-40 minutes</p>
                </div>
              </div>
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <strong>Fresh & Hot</strong>
                  <p>Prepared on order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
