import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of restaurants when the component mounts
    fetch('/restaurants')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching restaurants: ' + error.message);
        setLoading(false);
      });
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    // Fetch details for the selected restaurant when it's clicked
    fetch(`/restaurants/${restaurantId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Restaurant not found');
        }
        return response.json();
      })
      .then((data) => setSelectedRestaurant(data))
      .catch((error) => setError('Error fetching restaurant details: ' + error.message));
  };

  const handleDeleteRestaurant = (restaurantId) => {
    // Delete the selected restaurant
    fetch(`/restaurants/${restaurantId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Restaurant deletion failed');
        }
        // Remove the deleted restaurant from the list
        setRestaurants((prevRestaurants) =>
          prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
        );
        setSelectedRestaurant(null);
      })
      .catch((error) => setError('Error deleting restaurant: ' + error.message));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pizza Restaurants</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="restaurant-list">
          <h2>Restaurants</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <button onClick={() => handleRestaurantClick(restaurant.id)}>
                  {restaurant.name}
                </button>
                <button onClick={() => handleDeleteRestaurant(restaurant.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="restaurant-details">
          {selectedRestaurant && (
            <>
              <h2>Restaurant Details</h2>
              <p>Name: {selectedRestaurant.name}</p>
              <p>Address: {selectedRestaurant.address}</p>
              <h3>Pizzas</h3>
              <ul>
                {selectedRestaurant.pizzas.map((pizza) => (
                  <li key={pizza.id}>
                    <p>Name: {pizza.name}</p>
                    <p>Ingredients: {pizza.ingredients}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
