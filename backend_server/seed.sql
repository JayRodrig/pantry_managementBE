DROP DATABASE IF EXISTS pantry_management;
CREATE DATABASE pantry_management;

\c pantry_management;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR UNIQUE NOT NULL,
    dob VARCHAR,
    phone_number VARCHAR UNIQUE NOT NULL
);

CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR UNIQUE NOT NULL,
    health_tags VARCHAR NOT NULL,
    recipe_owner INT REFERENCES users(user_id) NOT NULL,
    recipe_notes VARCHAR
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR NOT NULL,
    product_url VARCHAR,
    product_image VARCHAR,
    product_original_weight VARCHAR NOT NULL,
    product_gram_weight INT NOT NULL,
    product_price VARCHAR NOT NULL,
    product_owner INT REFERENCES users(user_id) NOT NULL
);

CREATE TABLE current_pantry (
    product_id INT REFERENCES products(product_id),
    owner_id INT REFERENCES users(user_id),
    weight_left INT NOT NULL
);

CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR NOT NULL,
    recipe_id INT REFERENCES recipes(recipe_id) NOT NULL,
    product_id INT REFERENCES products(product_id) NOT NULL,
    ingredient_weight VARCHAR NOT NULL,
    ingredient_gram_weight INT NOT NULL
);

CREATE TABLE weekday (
    weekday_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE meal_schedule (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) NOT NULL,
    recipe_id INT REFERENCES recipes(recipe_id) NOT NULL,
    day_id INT REFERENCES weekday(weekday_id) NOT NULL
);

INSERT INTO weekday (name) VALUES
('Monday'), ('Tuesday'), ('Wednesday'), ('Thursday'), ('Friday');

INSERT INTO users (name, email, dob, phone_number) VALUES
('Jose Rodriguez', 'joserodriguez@pursuit.org', '01/01/1990', '1234567890'),
('Heriberto Uroza', 'heribertouroza@pursuit.org', '01/01/1990', '0987654321');

INSERT INTO recipes (recipe_name, health_tags, recipe_owner, recipe_notes) VALUES
('Chicken Over Rice', 'None', 1, 'Very tasteful Dominican recipe.'),
('Beef Over Rice', 'None', 1, 'Very tasteful Dominican recipe.'),
('Chicken Alfredo', 'None', 2, 'Very tasteful Italian recipe.');

INSERT INTO products (product_name, product_url, product_image, product_original_weight, product_gram_weight, product_price, product_owner) VALUES
(
    'Lundberg California White Basmati Rice', 'https://www.amazon.com/Lundberg-Family-Farms-Organic-Basmati/dp/B01E6OKVY0/ref=sr_1_3?keywords=organic%2Brice&qid=1557879879&s=gateway&sr=8-3&th=1', 
    'https://images-na.ssl-images-amazon.com/images/I/91U%2Be2ZGLkL._SY679_.jpg', '4 Pounds', 1814, '11.49', 1
),
(
    'Organic Whole Chicken', 'https://www.amazon.com/Perdue-Harvestland-Organic-Chicken-Giblets/dp/B06XC94RYT/ref=sr_1_17?fpw=fresh&keywords=chicken&qid=1557880034&s=gateway&sr=8-17',
    'https://images-na.ssl-images-amazon.com/images/I/91KY8eAtn3L._SX522_.jpg', '5 lb', 2268, '13.76', 1
),
(
    'Grass Fed, Lean Ground Beef', 'https://www.amazon.com/Pre-Lean-Ground-Beef-Pasture-Raised/dp/B01H0AI4VE/ref=sr_1_4?fpw=fresh&keywords=organic+beef&qid=1557880230&s=amazonfresh&sr=1-4',
    'https://images-na.ssl-images-amazon.com/images/I/81LS2vPN-DL._SX522_.jpg', '16oz', 454, '8.24', 1
),
(
    'Organic Chicken Breast', 'https://www.amazon.com/Pat-LaFrieda-Organic-Boneless-Skinless/dp/B00N8LTCKM/ref=sr_1_10?fpw=fresh&keywords=organic+chicken+breast&qid=1557880431&s=amazonfresh&sr=1-10',
    'https://images-na.ssl-images-amazon.com/images/I/7129BUea92L._SX522_.jpg', '1.5 lb', 680, '15.04', 2
),
(
    'Barilla Pasta Sauce, Creamy Alfredo', 'https://www.amazon.com/Barilla-Pasta-Sauce-Creamy-Alfredo/dp/B01DQXRYUG/ref=sr_1_6?fpw=fresh&keywords=alfredo%2Bsauce&qid=1557880563&s=amazonfresh&sr=1-6&th=1',
    'https://images-na.ssl-images-amazon.com/images/I/51ulslIRdML.jpg', '14.5 oz', 411, '2.85', 2
);

INSERT INTO current_pantry (product_id, owner_id, weight_left) VALUES
(1, 1, 1814),
(2, 1, 2268),
(3, 1, 454),
(4, 2, 680),
(5, 2, 411);

INSERT INTO ingredients (ingredient_name, recipe_id, product_id, ingredient_weight, ingredient_gram_weight) VALUES
('Rice', 1, 1, '3 cups', 500),
('Chicken', 1, 2, '2 pounds', 907),
('Rice', 2, 1, '3 cups', 500),
('Beef', 2, 3, '10 oz', 283),
('Chicken Breast', 3, 4, '0.5 lbs', 227),
('Alfredo Sauce', 3, 5, '5 oz', 142);

INSERT INTO meal_schedule (user_id, recipe_id, day_id) VALUES
(1, 1, 1),
(1, 2, 4),
(2, 3, 3);