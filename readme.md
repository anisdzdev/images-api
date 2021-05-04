<h1 align="center">Welcome to Image Repository API 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> Image repository api created for the Shopify Developer Challenge. It implements features such as image uplaod, image search, password encryption, secure data handling.

## Install

```sh
npm install
```

## Usage

```sh
npm run start
```

<br><br>

## User Routes

To create a new user account. This is a necessary step to obtain a new Authorization Token.<br>
3 body parameters (JSON/Form-Data) : ```name, email, password```
```sh
POST localhost:3000/api/users/create
```

To login an existing user account. This routes lets the user get a new Token.<br>
2 body parameters (JSON/Form-Data) : ```email, password```
```sh
POST localhost:3000/api/users/login
```

To delete the current user. <br>
Authorization : ```Bearer <Token>```
```sh
DELETE localhost:3000/api/users/
```
<br><br>

## Image Routes

Takes the id of an image and returns the information about that image.<br>
1 parameter (URL) : ```id```
```sh
GET localhost:3000/api/images/:id
```

Takes the id of a user and returns all the images published by the user.<br>
1 parameter (URL) : ```id```
```sh
GET localhost:3000/api/images/user/:id
```

Returns all the images having a title/description matching the query string. The query is separated by spaces for multi-keyword search.<br>
1 parameter (URL) : ```query```
```sh
GET localhost:3000/api/images/search/:query
```

To post a new image under the user with the Token passed in the Authorization header. It returns the created image.<br>
3 body parameters (Form-Data) : ```image(as file), title, description```<br>
Authorization : ```Bearer <Token>```
```sh
POST localhost:3000/api/images/
```

To edit an existing image with id "id". It only allows the user who owns the image to edit it.<br>
2 optional body parameters (JSON/Form-Data) : ```title, description```<br>
Authorization : ```Bearer <Token>```
```sh
PATCH localhost:3000/api/images/:id
```

To delete an existing image with id "id". It only allows the user who owns the image to delete it.<br>
1 parameter (URL) : ```id```<br>
Authorization : ```Bearer <Token>```
```sh
DELETE localhost:3000/api/images/:id
```

<br><br>

## File Routes

Returns the actual image posted by user_id with id image_id.<br>
2 parameters (URL) : ```user_id, image_id```
```sh
GET localhost:3000/files/:user_id/:image_id
```

<br><br>



## Author

👤 **Anis Brachemi**

* Github: [@anisdzdev](https://github.com/anisdzdev)

## Show your support

Give a ⭐️ if you liked it!

