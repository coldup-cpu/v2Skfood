import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { Button, Card } from '../../components/UI';
import './Checkout.css';

const Checkout = () => {
  const { isAuthenticated } = useAuth();
  const {
    address,
    updateAddress,
    specialInstructions,
    updateSpecialInstructions,
    calculatePrice
  } = useOrder();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    street: address?.street || '',
    apartment: address?.apartment || '',
    landmark: address?.landmark || '',
    city: address?.city || '',
    pincode: address?.pincode || ''
  });

  const [instructions, setInstructions] = useState(specialInstructions || '');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (validateForm()) {
      updateAddress(formData);
      updateSpecialInstructions(instructions);
      navigate('/payment');
    }
  };

  const handleBack = () => {
    navigate('/order-summary');
  };

  const pricing = calculatePrice();

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button onClick={handleBack} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Delivery Details</h1>
          <p className="page-subtitle">Where should we deliver your order?</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            <Card className="address-card">
              <h2 className="card-title">Delivery Address</h2>

              <form onSubmit={handleSubmit} className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`form-input ${errors.fullName ? 'error' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="9876543210"
                      maxLength="10"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="street" className="form-label">
                    Street Address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className={`form-input ${errors.street ? 'error' : ''}`}
                    placeholder="House No., Street Name"
                  />
                  {errors.street && <span className="error-message">{errors.street}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="apartment" className="form-label">
                    Apartment / Building (Optional)
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Apartment, Suite, Floor, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="landmark" className="form-label">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Near xyz"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      City <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`form-input ${errors.city ? 'error' : ''}`}
                      placeholder="Mumbai"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode" className="form-label">
                      Pincode <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`form-input ${errors.pincode ? 'error' : ''}`}
                      placeholder="400001"
                      maxLength="6"
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>
              </form>
            </Card>

            <Card className="instructions-card">
              <h2 className="card-title">Special Instructions</h2>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="instructions-textarea"
                placeholder="Any special requests? (e.g., extra spicy, less oil, gate code, etc.)"
                rows="4"
              />
            </Card>
          </div>

          <div className="checkout-sidebar">
            <Card className="order-summary-card">
              <h2 className="card-title">Order Summary</h2>

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="summary-line discount">
                    <span>Discount</span>
                    <span>-₹{Math.round(pricing.discount)}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Tax</span>
                  <span>₹{Math.round(pricing.tax)}</span>
                </div>
                <div className="summary-line">
                  <span>Delivery</span>
                  <span>₹{pricing.deliveryFee}</span>
                </div>
                <div className="summary-line total">
                  <span>Total</span>
                  <span>₹{pricing.total}</span>
                </div>
              </div>

              <Button
                className="btn-primary-customer"
                size="lg"
                onClick={handleSubmit}
                style={{ width: '100%' }}
              >
                Proceed to Payment
              </Button>
            </Card>

            <div className="delivery-time-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div>
                <strong>Estimated Delivery</strong>
                <p>30-40 minutes after order confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
