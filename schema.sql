-- --------------------------------------------------------
-- Weily E-Commerce Database Schema (MySQL)
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS weily_db;
USE weily_db;

-- 1. Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    oldPrice DECIMAL(10,2) DEFAULT NULL,
    discount INT DEFAULT 0,
    description TEXT NOT NULL,
    categoryId VARCHAR(50) NOT NULL,
    stockStatus VARCHAR(20) DEFAULT 'available', -- 'available', 'low_stock', 'out_of_stock'
    stockCount INT DEFAULT 0,
    isFeatured BOOLEAN DEFAULT FALSE,
    isNew BOOLEAN DEFAULT FALSE,
    isDeal BOOLEAN DEFAULT FALSE,
    isBestSeller BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: product_images
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(50) PRIMARY KEY,
    productId VARCHAR(50) NOT NULL,
    imageUrl LONGTEXT NOT NULL, -- Can hold Local Upload Path or Base64 Data
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table: users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL, -- SHA-256 or bcrypt hash
    role VARCHAR(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table: config
CREATE TABLE IF NOT EXISTS config (
    id VARCHAR(50) PRIMARY KEY,
    siteName VARCHAR(100) NOT NULL,
    whatsappPhone VARCHAR(50) NOT NULL,
    currencySymbol VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Seed Data (Default configurations)
-- --------------------------------------------------------

INSERT INTO config (id, siteName, whatsappPhone, currencySymbol) 
VALUES ('site_settings', 'Weily', '+50497650096', 'L')
ON DUPLICATE KEY UPDATE siteName=VALUES(siteName);

-- Default admin user (username: admin, passwordHash for 'admin123' using SHA-256: '24078368a2ec01a700c0f8f89a9f24b07c2a71bf9e6587391a26569ecdf17f94')
INSERT INTO users (id, username, passwordHash, role)
VALUES ('admin_user', 'admin', '24078368a2ec01a700c0f8f89a9f24b07c2a71bf9e6587391a26569ecdf17f94', 'admin')
ON DUPLICATE KEY UPDATE username=VALUES(username);
