/**
 * Seed script â€” populates MongoDB (assignments) and PostgreSQL (sample tables/data).
 *
 * Usage:  npm run seed          (from server/)
 * Requires: .env with MONGO_URI and PG_* variables
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const { Pool } = require('pg');
const Assignment = require('../models/Assignment');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

const seedPostgres = async () => {
  console.log('Seeding PostgreSQLâ€¦');
  await pool.query(`
    DROP TABLE IF EXISTS order_items, orders, products, customers, employees, departments CASCADE;
  `);

  /* â”€â”€â”€ departments & employees â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  await pool.query(`
    CREATE TABLE departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
  `);
  await pool.query(`
    INSERT INTO departments (name) VALUES
      ('Engineering'), ('Marketing'), ('Sales'), ('HR'), ('Finance');
  `);

  await pool.query(`
    CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50),
      last_name  VARCHAR(50),
      email      VARCHAR(120),
      salary     NUMERIC(10,2),
      dept_id    INT REFERENCES departments(id),
      hire_date  DATE
    );
  `);
  await pool.query(`
    INSERT INTO employees (first_name,last_name,email,salary,dept_id,hire_date) VALUES
      ('Alice','Johnson','alice@company.com',85000,1,'2021-03-15'),
      ('Bob','Smith','bob@company.com',72000,1,'2022-07-01'),
      ('Carol','Williams','carol@company.com',68000,2,'2020-01-20'),
      ('David','Brown','david@company.com',91000,3,'2019-11-10'),
      ('Eve','Davis','eve@company.com',77500,4,'2023-02-28'),
      ('Frank','Miller','frank@company.com',64000,2,'2021-09-05'),
      ('Grace','Wilson','grace@company.com',95000,5,'2018-06-12'),
      ('Hank','Moore','hank@company.com',71000,1,'2022-04-18'),
      ('Ivy','Taylor','ivy@company.com',83000,3,'2020-08-22'),
      ('Jack','Anderson','jack@company.com',69000,5,'2023-01-09');
  `);

  /* â”€â”€â”€ customers, products, orders, order_items â”€â”€â”€â”€ */
  await pool.query(`
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name   VARCHAR(100),
      email  VARCHAR(120),
      city   VARCHAR(80),
      joined DATE
    );
  `);
  await pool.query(`
    INSERT INTO customers (name,email,city,joined) VALUES
      ('Acme Corp','acme@mail.com','New York','2022-01-15'),
      ('Globex Inc','globex@mail.com','Chicago','2021-06-20'),
      ('Soylent Co','soylent@mail.com','San Francisco','2023-03-10'),
      ('Initech','initech@mail.com','Austin','2020-11-01'),
      ('Umbrella LLC','umbrella@mail.com','Seattle','2022-08-05');
  `);

  await pool.query(`
    CREATE TABLE products (
      id    SERIAL PRIMARY KEY,
      name  VARCHAR(100),
      price NUMERIC(10,2),
      category VARCHAR(50)
    );
  `);
  await pool.query(`
    INSERT INTO products (name,price,category) VALUES
      ('Laptop',999.99,'Electronics'),
      ('Mouse',29.99,'Electronics'),
      ('Desk Chair',249.50,'Furniture'),
      ('Monitor',349.00,'Electronics'),
      ('Keyboard',79.99,'Electronics'),
      ('Standing Desk',599.00,'Furniture'),
      ('Webcam',89.99,'Electronics'),
      ('Headphones',159.99,'Electronics');
  `);

  await pool.query(`
    CREATE TABLE orders (
      id          SERIAL PRIMARY KEY,
      customer_id INT REFERENCES customers(id),
      order_date  DATE,
      status      VARCHAR(30)
    );
  `);
  await pool.query(`
    INSERT INTO orders (customer_id,order_date,status) VALUES
      (1,'2024-01-10','completed'),
      (2,'2024-01-12','completed'),
      (1,'2024-02-20','processing'),
      (3,'2024-02-25','completed'),
      (4,'2024-03-05','shipped'),
      (5,'2024-03-10','completed'),
      (2,'2024-03-15','cancelled'),
      (3,'2024-04-01','processing');
  `);

  await pool.query(`
    CREATE TABLE order_items (
      id         SERIAL PRIMARY KEY,
      order_id   INT REFERENCES orders(id),
      product_id INT REFERENCES products(id),
      quantity   INT
    );
  `);
  await pool.query(`
    INSERT INTO order_items (order_id,product_id,quantity) VALUES
      (1,1,1),(1,2,2),(2,3,1),(2,5,1),(3,4,2),
      (4,1,1),(4,6,1),(5,7,3),(6,2,5),(6,8,1),
      (7,4,1),(8,5,2),(8,3,1);
  `);

  console.log('PostgreSQL seeded âœ”');
};

const seedMongo = async () => {
  console.log('Seeding MongoDBâ€¦');
  await mongoose.connect(process.env.MONGO_URI);
  await Assignment.deleteMany({});

  const assignments = [
    {
      title: 'List All Employees',
      description: 'Write a query to retrieve all columns from the employees table, ordered by last name alphabetically.',
      difficulty: 'easy',
      tables: [
        {
          tableName: 'employees',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'first_name', dataType: 'VARCHAR' },
            { name: 'last_name', dataType: 'VARCHAR' },
            { name: 'email', dataType: 'VARCHAR' },
            { name: 'salary', dataType: 'NUMERIC' },
            { name: 'dept_id', dataType: 'INT' },
            { name: 'hire_date', dataType: 'DATE' },
          ],
        },
      ],
      sampleQuery: 'SELECT * FROM employees ORDER BY last_name;',
    },
    {
      title: 'Department Salary Stats',
      description: 'Find the average salary for each department. Display the department name and the average salary, rounded to 2 decimal places. Order by average salary descending.',
      difficulty: 'medium',
      tables: [
        {
          tableName: 'employees',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'first_name', dataType: 'VARCHAR' },
            { name: 'last_name', dataType: 'VARCHAR' },
            { name: 'salary', dataType: 'NUMERIC' },
            { name: 'dept_id', dataType: 'INT' },
          ],
        },
        {
          tableName: 'departments',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'name', dataType: 'VARCHAR' },
          ],
        },
      ],
      sampleQuery:
        "SELECT d.name, ROUND(AVG(e.salary),2) AS avg_salary FROM employees e JOIN departments d ON e.dept_id=d.id GROUP BY d.name ORDER BY avg_salary DESC;",
    },
    {
      title: 'Top Spending Customers',
      description: 'Find customers who have spent more than $500 in total across all their completed orders. Show customer name, city, and total spent. Hint: you will need to join customers, orders, order_items, and products.',
      difficulty: 'hard',
      tables: [
        {
          tableName: 'customers',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'name', dataType: 'VARCHAR' },
            { name: 'email', dataType: 'VARCHAR' },
            { name: 'city', dataType: 'VARCHAR' },
            { name: 'joined', dataType: 'DATE' },
          ],
        },
        {
          tableName: 'orders',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'customer_id', dataType: 'INT' },
            { name: 'order_date', dataType: 'DATE' },
            { name: 'status', dataType: 'VARCHAR' },
          ],
        },
        {
          tableName: 'order_items',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'order_id', dataType: 'INT' },
            { name: 'product_id', dataType: 'INT' },
            { name: 'quantity', dataType: 'INT' },
          ],
        },
        {
          tableName: 'products',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'name', dataType: 'VARCHAR' },
            { name: 'price', dataType: 'NUMERIC' },
            { name: 'category', dataType: 'VARCHAR' },
          ],
        },
      ],
      sampleQuery:
        "SELECT c.name, c.city, SUM(p.price * oi.quantity) AS total_spent FROM customers c JOIN orders o ON c.id=o.customer_id JOIN order_items oi ON o.id=oi.order_id JOIN products p ON oi.product_id=p.id WHERE o.status='completed' GROUP BY c.name, c.city HAVING SUM(p.price*oi.quantity)>500 ORDER BY total_spent DESC;",
    },
    {
      title: 'Employees Hired in 2022',
      description: 'List the first name, last name, and hire date of all employees who were hired in the year 2022. Sort results by hire date.',
      difficulty: 'easy',
      tables: [
        {
          tableName: 'employees',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'first_name', dataType: 'VARCHAR' },
            { name: 'last_name', dataType: 'VARCHAR' },
            { name: 'hire_date', dataType: 'DATE' },
          ],
        },
      ],
      sampleQuery: "SELECT first_name, last_name, hire_date FROM employees WHERE EXTRACT(YEAR FROM hire_date)=2022 ORDER BY hire_date;",
    },
    {
      title: 'Products Never Ordered',
      description: 'Find all products that have never appeared in any order. Display the product name and price.',
      difficulty: 'medium',
      tables: [
        {
          tableName: 'products',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'name', dataType: 'VARCHAR' },
            { name: 'price', dataType: 'NUMERIC' },
            { name: 'category', dataType: 'VARCHAR' },
          ],
        },
        {
          tableName: 'order_items',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'order_id', dataType: 'INT' },
            { name: 'product_id', dataType: 'INT' },
            { name: 'quantity', dataType: 'INT' },
          ],
        },
      ],
      sampleQuery:
        "SELECT p.name, p.price FROM products p LEFT JOIN order_items oi ON p.id=oi.product_id WHERE oi.id IS NULL;",
    },
    {
      title: 'Order Summary Report',
      description: 'Create a summary showing each order ID, the customer name, order date, order status, and the total number of items in that order. Sort by order date descending.',
      difficulty: 'medium',
      tables: [
        {
          tableName: 'orders',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'customer_id', dataType: 'INT' },
            { name: 'order_date', dataType: 'DATE' },
            { name: 'status', dataType: 'VARCHAR' },
          ],
        },
        {
          tableName: 'customers',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'name', dataType: 'VARCHAR' },
          ],
        },
        {
          tableName: 'order_items',
          columns: [
            { name: 'id', dataType: 'SERIAL' },
            { name: 'order_id', dataType: 'INT' },
            { name: 'product_id', dataType: 'INT' },
            { name: 'quantity', dataType: 'INT' },
          ],
        },
      ],
      sampleQuery:
        "SELECT o.id AS order_id, c.name AS customer, o.order_date, o.status, SUM(oi.quantity) AS total_items FROM orders o JOIN customers c ON o.customer_id=c.id JOIN order_items oi ON o.id=oi.order_id GROUP BY o.id, c.name, o.order_date, o.status ORDER BY o.order_date DESC;",
    },
  ];

  await Assignment.insertMany(assignments);
  console.log(`Inserted ${assignments.length} assignments into MongoDB âœ”`);
};

(async () => {
  try {
    await seedPostgres();
    await seedMongo();
    console.log('All seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
