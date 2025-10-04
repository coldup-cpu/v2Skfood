import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { userAPI } from '../../services/api';
import { Button, Card, Badge } from '../../components/UI';
import './MealBuilder.css';

const MealBuilder = () => {
  const [menu, setMenu] = useState(null);
  const [mealType, setMealType] = useState('lunch');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    selectedSabjis,
    selectedBase,
    extraRoti,
    selectSabji,
    selectBase,
    updateExtraRoti,
    calculatePrice
  } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    const currentMealType = hour >= 19 || hour < 12 ? 'dinner' : 'lunch';
    setMealType(currentMealType);
    fetchMenu(currentMealType);
  }, []);

  const fetchMenu = async (type) => {
    try {
      setLoading(true);
      const response = type === 'lunch'
        ? await userAPI.getLunchMenu()
        : await userAPI.getDinnerMenu();

      if (response.data && response.data.length > 0) {
        setMenu(response.data[0]);
      } else {
        setError('No menu available for today');
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleMealTypeChange = (type) => {
    setMealType(type);
    fetchMenu(type);
  };

  const isSabjiSelected = (sabji) => {
    return selectedSabjis.some(s => s.name === sabji.name);
  };

  const canSelectMore = selectedSabjis.length < 2;

  const handleContinue = () => {
    if (selectedSabjis.length === 2) {
      navigate('/order-summary');
    }
  };

  const pricing = calculatePrice();

  if (loading) {
    return (
      <div className="meal-builder-loading">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meal-builder-error">
        <p>{error}</p>
        <Button onClick={() => fetchMenu(mealType)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="meal-builder-page">
      <div className="meal-builder-container">
        <div className="meal-builder-header">
          <h1 className="page-title">Build Your Thali</h1>
          <p className="page-subtitle">Choose 2 sabjis and customize your base</p>
        </div>

        <div className="meal-type-selector">
          <button
            className={`meal-type-btn ${mealType === 'lunch' ? 'active' : ''}`}
            onClick={() => handleMealTypeChange('lunch')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            Lunch (12-3 PM)
          </button>
          <button
            className={`meal-type-btn ${mealType === 'dinner' ? 'active' : ''}`}
            onClick={() => handleMealTypeChange('dinner')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            Dinner (7-10 PM)
          </button>
        </div>

        <div className="selection-summary">
          <div className="summary-item">
            <span className="summary-label">Sabjis Selected:</span>
            <span className="summary-value">{selectedSabjis.length}/2</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Base:</span>
            <span className="summary-value">{selectedBase === 'roti' ? '5 Rotis' : selectedBase === 'combo' ? '3 Rotis + Rice' : 'Rice Only'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total:</span>
            <span className="summary-value">₹{pricing.perThaliPrice}</span>
          </div>
        </div>

        <section className="sabjis-section">
          <h2 className="section-title">
            Choose Your Sabjis
            <span className="section-badge">Select 2</span>
          </h2>

          <div className="sabjis-grid">
            {menu?.listOfSabjis?.map((sabji, index) => {
              const isSelected = isSabjiSelected(sabji);
              const canSelect = canSelectMore || isSelected;

              return (
                <Card
                  key={index}
                  className={`sabji-card ${isSelected ? 'selected' : ''} ${!canSelect ? 'disabled' : ''}`}
                  onClick={() => canSelect && selectSabji(sabji)}
                >
                  <div className="sabji-image">
                    <img
                      src={sabji.imageUrl || 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'}
                      alt={sabji.name}
                    />
                    {sabji.isSpecial && (
                      <Badge className="badge-special">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        Special
                      </Badge>
                    )}
                    {isSelected && (
                      <div className="selection-check">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="sabji-content">
                    <h3 className="sabji-name">{sabji.name}</h3>
                    {sabji.isSpecial && <p className="sabji-price">+₹20</p>}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="base-section">
          <h2 className="section-title">Choose Your Base</h2>

          <div className="base-options">
            <button
              className={`base-option ${selectedBase === 'roti' ? 'selected' : ''}`}
              onClick={() => selectBase('roti')}
            >
              <div className="base-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div className="base-details">
                <h3 className="base-name">5 Rotis</h3>
                <p className="base-description">Perfect for roti lovers</p>
              </div>
              {selectedBase === 'roti' && (
                <div className="base-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </button>

            <button
              className={`base-option ${selectedBase === 'combo' ? 'selected' : ''}`}
              onClick={() => selectBase('combo')}
            >
              <div className="base-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="base-details">
                <h3 className="base-name">3 Rotis + Rice</h3>
                <p className="base-description">Best of both worlds</p>
              </div>
              {selectedBase === 'combo' && (
                <div className="base-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </button>

            <button
              className={`base-option ${selectedBase === 'rice' ? 'selected' : ''}`}
              onClick={() => selectBase('rice')}
            >
              <div className="base-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <div className="base-details">
                <h3 className="base-name">Rice Only</h3>
                <p className="base-description">For rice enthusiasts</p>
              </div>
              {selectedBase === 'rice' && (
                <div className="base-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </button>
          </div>

          <div className="extra-roti-section">
            <div className="extra-roti-header">
              <h3>Add Extra Rotis</h3>
              <p className="extra-roti-price">₹5 per roti (max 3)</p>
            </div>
            <div className="extra-roti-control">
              <button
                className="quantity-btn"
                onClick={() => updateExtraRoti(extraRoti - 1)}
                disabled={extraRoti === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="quantity-value">{extraRoti}</span>
              <button
                className="quantity-btn"
                onClick={() => updateExtraRoti(extraRoti + 1)}
                disabled={extraRoti === 3}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <div className="action-bar">
          <div className="action-price">
            <span className="price-label">Price per Thali</span>
            <span className="price-value">₹{pricing.perThaliPrice}</span>
          </div>
          <Button
            className="btn-primary-customer"
            size="lg"
            onClick={handleContinue}
            disabled={selectedSabjis.length !== 2}
          >
            Continue to Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealBuilder;
