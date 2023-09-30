from app import app, db  # Import the Flask app and SQLAlchemy instance
from models import Restaurant, Pizza, RestaurantPizza  # Import your models

# Create a function to seed the data
def seed_data():
    # Create sample restaurants
    restaurant1 = Restaurant(name="Sottocasa NYC", address="298 Atlantic Ave, Brooklyn, NY 11201")
    restaurant2 = Restaurant(name="PizzArte", address="69 W 55th St, New York, NY 10019")

    # Create sample pizzas
    pizza1 = Pizza(name="Cheese", ingredients="Dough, Tomato Sauce, Cheese")
    pizza2 = Pizza(name="Pepperoni", ingredients="Dough, Tomato Sauce, Cheese, Pepperoni")

    # Create restaurant-pizza relationships with prices
    restaurant_pizza1 = RestaurantPizza(price=10.0, restaurant=restaurant1, pizza=pizza1)
    restaurant_pizza2 = RestaurantPizza(price=12.0, restaurant=restaurant1, pizza=pizza2)
    restaurant_pizza3 = RestaurantPizza(price=11.0, restaurant=restaurant2, pizza=pizza1)

    # Add objects to the session and commit to the database
    with app.app_context():
        db.session.add(restaurant1)
        db.session.add(restaurant2)
        db.session.add(pizza1)
        db.session.add(pizza2)
        db.session.add(restaurant_pizza1)
        db.session.add(restaurant_pizza2)
        db.session.add(restaurant_pizza3)
        db.session.commit()

if __name__ == "__main__":
    seed_data()
