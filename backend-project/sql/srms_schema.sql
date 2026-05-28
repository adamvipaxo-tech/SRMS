CREATE DATABASE IF NOT EXISTS srms;
USE srms;

CREATE TABLE IF NOT EXISTS customers (
  customerNumber INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(80) NOT NULL,
  lastName VARCHAR(80) NOT NULL,
  telephone VARCHAR(25) NOT NULL,
  address VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  productCode INT AUTO_INCREMENT PRIMARY KEY,
  productName VARCHAR(120) NOT NULL,
  quantitySold INT NOT NULL DEFAULT 0,
  unitPrice DECIMAL(12,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
  invoiceNumber INT AUTO_INCREMENT PRIMARY KEY,
  customerNumber INT NOT NULL,
  productCode INT NOT NULL,
  quantitySold INT NOT NULL,
  salesDate DATE NOT NULL,
  paymentMethod ENUM('Cash', 'Card', 'Mobile Money', 'Bank Transfer') NOT NULL,
  totalAmountPaid DECIMAL(12,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_customer FOREIGN KEY (customerNumber) REFERENCES customers(customerNumber) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sales_product FOREIGN KEY (productCode) REFERENCES products(productCode) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default account: username = admin, password = admin123
INSERT INTO users (username, passwordHash)
SELECT 'admin', 'admin123'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
