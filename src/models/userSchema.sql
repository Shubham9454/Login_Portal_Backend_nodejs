-- Create database
Create DATABASE IF NOT EXISTS login_portal_db;

-- Use the database
USE login_portal_db;

-- Create users table
CREATE TABLE users (
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    emaildID VARCHAR(50) PRIMARY KEY,
    password  VARCHAR(60) NOT NULL,
    role ENUM('admin', 'normal_user') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_pswd_length CHECK (CHAR_LENGTH(password) >= 6 AND CHAR_LENGTH(password) <= 60),
);

INSERT INTO users VALUES
(
    'John',
    'Doe',
    'john123@gmail.com',
    'John@123',
    'normal_user'
),
(
    'Arthur',
    'Wallesely',
    'arthur123@gmail.com',
    'Arthur@123',
    'admin'
);
