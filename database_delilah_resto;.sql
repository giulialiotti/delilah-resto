create database delilah_resto;

use delilah_resto;
create table products(
ID int primary key not null AUTO_INCREMENT,
description varchar(100),
price varchar(20) not null,
quantity numeric not null
);

create table users (
ID int primary key not null AUTO_INCREMENT,
username varchar (20) not null,
name_and_surname varchar(50) not null,
email  varchar(100) not null,
phone numeric not null,
shipping_address varchar(120) not null, 
pass varchar(30) not null,
rol varchar(6) not null,
token int not null                  
);

create table orders (
ID int primary key not null AUTO_INCREMENT,
ID_user int not null,
order_time varchar(8) not null,
description varchar(20) not null,
total numeric not null,
order_status varchar(20) not null,
payment_method varchar(30) not null
);

create table favorites (
ID int primary key NOT NULL AUTO_INCREMENT,
ID_user int NOT NULL,
ID_product int NOT NULL
);


