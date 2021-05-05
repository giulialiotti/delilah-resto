create database delilah_resto;

use delilah_resto;

create table products(
    ID int primary key not null AUTO_INCREMENT,
    description varchar(100),
    price numeric not null,
    image_url varchar(128)
);

create table users (
    ID int primary key not null AUTO_INCREMENT,
    username varchar (20) not null,
    name_and_surname varchar(50) not null,
    email  varchar(100) not null,
    phone numeric not null,
    shipping_address varchar(120) not null, 
    password varchar(120) not null,
    role ENUM('Admin', 'Basic') not null,                
);

create table orders (
    ID int primary key not null AUTO_INCREMENT,
    ID_user int not null,
    order_time datetime not null,
    order_status enum('new', 'confirmed',
'preparing', 'sending', 'delivering',
'cancelled') not null,
    payment_method varchar(30) not null,
    total decimal not null
);

create table ordertoproducts (
    ID int primary key not null AUTO_INCREMENT,
    order_id integer,
    product_id integer,
    quantity decimal not null
);



