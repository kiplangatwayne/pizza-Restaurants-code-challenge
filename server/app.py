from flask import Flask, jsonify, request
from models import db, Restaurant, Pizza, RestaurantPizza
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pizza_restaurants.db'  # Adjust the database URI as needed
db.init_app(app)
migrate = Migrate(app, db)


# Create tables if they don't exist (you can use Flask-Migrate for production)
with app.app_context():
    db.create_all()

@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    restaurant_list = [{'id': r.id, 'name': r.name, 'address': r.address} for r in restaurants]
    return jsonify(restaurant_list)

@app.route('/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if restaurant:
        pizzas = [{'id': p.id, 'name': p.name, 'ingredients': p.ingredients} for p in restaurant.pizzas]
        restaurant_data = {
            'id': restaurant.id,
            'name': restaurant.name,
            'address': restaurant.address,
            'pizzas': pizzas
        }
        return jsonify(restaurant_data)
    else:
        return jsonify({'error': 'Restaurant not found'}), 404

@app.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if restaurant:
        # Delete associated RestaurantPizza records
        RestaurantPizza.query.filter_by(restaurant_id=restaurant_id).delete()
        db.session.delete(restaurant)
        db.session.commit()
        return ('', 204)
    else:
        return jsonify({'error': 'Restaurant not found'}), 404

@app.route('/pizzas', methods=['GET'])
def get_pizzas():
    pizzas = Pizza.query.all()
    pizza_list = [{'id': p.id, 'name': p.name, 'ingredients': p.ingredients} for p in pizzas]
    return jsonify(pizza_list)

@app.route('/restaurant_pizzas', methods=['POST'])
def create_restaurant_pizza():
    data = request.get_json()
    price = data.get('price')
    pizza_id = data.get('pizza_id')
    restaurant_id = data.get('restaurant_id')

    # Validate price
    if not (1 <= price <= 30):
        return jsonify({'errors': ['Validation error: Price must be between 1 and 30']}), 400

    restaurant = Restaurant.query.get(restaurant_id)
    pizza = Pizza.query.get(pizza_id)

    if restaurant and pizza:
        restaurant_pizza = RestaurantPizza(price=price, restaurant=restaurant, pizza=pizza)
        db.session.add(restaurant_pizza)
        db.session.commit()
        return jsonify({'id': pizza.id, 'name': pizza.name, 'ingredients': pizza.ingredients})
    else:
        return jsonify({'errors': ['Validation error: Restaurant or Pizza not found']}), 400

if __name__ == '__main__':
    app.run(debug=True)
