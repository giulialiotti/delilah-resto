# Delilah Restó - REST API 

Online ordering system for a restaurant   
Project 3 - Acámica Full Stack Web Development Career

## Modules
 
 - express
 - sequelize
 - mysql2
 - bcrypt
 - cors
 - express-validator
 - jsonwebtoken
 - morgan
 - dotenv
 

## Installation 

#### Node

``` 
  npm install
```
#### Database

1. Install mysql and create a database by copying and pasting the data from the file "database_delilah_resto; .sql" in a SQL query.
2. Verify that the database and tables were created correctly.

#### JWT

Create a `.env` file and add the following:

``` 
  ACCESS_TOKEN_SECRET=5c861fadc814320bc767df897f8949652f375f6efba977a10d3d4b1c157b50bd67b992ab03cd5a884f63a35bf1aec408c959dba16baa7b55d1199e843e91f071
```

## Running the API

#### Using local node server

Yo can run the api with command

``` 
  npm run dev
```

#### Swagger

To interact with the API and its endpoints open the file called "swagger.yaml" and press "Shift + Alt + p". For this to work you must have the "Swagger Viewer" extension installed.

To use an admin example you can use these credentials:

``` 
  username: admin
  password: 1234
```

To access the restricted endpoints you must use the `login` endpoint first, copy the access token and click on the `authorize` option.