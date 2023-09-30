import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    // Fetch the list of restaurants
    fetch('/restaurants')
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error('Error fetching restaurants:', error));
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    // Fetch details for the selected restaurant
    fetch(`/restaurants/${restaurantId}`)
      .then((response) => {
        if (response.status === 404) {
          throw new Error('Restaurant not found');
        }
        return response.json();
      })
      .then((data) => setSelectedRestaurant(data))
      .catch((error) => console.error('Error fetching restaurant details:', error));
  };

  const handleDeleteRestaurant = (restaurantId) => {
    // Delete the selected restaurant
    fetch(`/restaurants/${restaurantId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Remove the deleted restaurant from the list
        setRestaurants((prevRestaurants) =>
          prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
        );
        setSelectedRestaurant(null);
      })
      .catch((error) => console.error('Error deleting restaurant:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pizza Restaurants</h1>
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
