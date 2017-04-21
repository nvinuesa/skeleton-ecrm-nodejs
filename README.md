# skeleton-ecrm-nodejs
Customer Relationship Management module skeleton in NodeJS

## Usage
Clone the repo, install and launch:
```
git clone https://github.com/underscorenico/skeleton-ecrm-nodejs.git
cd skeleton-ecrm-nodejs
npm install
npm start
```
The start script will run the server (using nodemon) on port 3000 (http://localhost:3000)
## Overview
This skeleton provides an API for CRM (Customer Relationship Management). CRM is a central module in every e-commerce application since it manages users (buyers / sellers), organizations, sessions, etc.
<br>
The routes provide a very simple profile CRUD as well as the session management (login and logout).
<br>
<br>
**Note**: For a working web app skeleton in Angular 2 check out [this repo][angular2].

[angular2]: https://github.com/JunkyDeLuxe/angular4-starter

### Profiles
The profile API contains 5 routes:
 
Method | URL (relative) | Description 
--- | --- | --- 
POST | /profiles | Create a profile
GET | /profiles/*{id}* | Retrieve a profile 	
GET | /profiles | Retrieve all profiles
PUT | /profiles/*{id}* | Update a profile 	
DELETE | /profiles/*{id}* | Delete a profile 	

The ```profile``` model that is to be passed in the POST request is the following:

```
{
  name: String,
  email: String,
  password: String
}
```

### (Pseudo) Sessions
This module does not use sessions. Instead, it uses [Json Web Tokens (JWT)][jwt] for authentication and securing the routes.
<br>
Two routes are provided for login and logout:

Method | URL (relative) | Description 
--- | --- | --- 
POST | /login | Log-in
GET | /logout | Log-out


JWT's library generates tokens that are stateless (i.e. tokens that carry every information needed in order to be authenticated). This feature makes them very useful for applications that (possibly) do not have access to cookies on the client side (e.g. mobile apps).
<br>
It's main drawback, however, is that you will have to manage the sessions yourself (because they are stateless).
<br>
In this skeleton, I provide you with a secure mechanism for token revocation (blacklisting tokens). This is needed when you want to make sure that when a user logs out, the previous token that the user obtained is now invalidated. 
<br>
This was achieved by blacklisting the tokens either in an in-memory key-value store (that **must never** be used in production) or in a [Redis][redis] database.
<br>
The functions ```isTokenRevoked``` and ```logout``` in ```session-service.js``` implement this mechanism:

```javascript
exports.isTokenRevoked = function (email, tokenId, callback) {

	if (conf.redis) {
		// If redis is defined in the conf files

		const port = conf.redis.port || '6379'; // Redis default port
		const host = conf.redis.host || 'localhost';

		const client = redis.createClient(port, host);
		client.get(email, function (err, reply) {
			callback(err, reply === tokenId);
		})
	} else {
		//	Else we use the mem cache

		const reply = memoryStore.get(email);
		callback(null, reply === tokenId);
	}
};

exports.logout = function (email, tokenId, next) {

	if (conf.redis) {
		// If redis is defined in the conf files

		const port = conf.redis.port || '6379'; // Redis default port
		const host = conf.redis.host || 'localhost';

		const client = redis.createClient(port, host);
		client.set(email, tokenId, function (err) {
			next(err);
		})
	} else {
		//	Else we use the mem cache

		memoryStore.set(email, tokenId);
		next(null);
	}
};
```
```isTokenRevoked``` is then passed to the [Express-jwt][expressjwt] middleware in order to filter requests with revoked tokens.

[expressjwt]: https://github.com/auth0/express-jwt

Redis is automatically configured for you, or you can set its hostname and port in the configuration files. 
<br>
For example:

```javascript
module.exports = {
	redis: {
	  hostname: "127.0.0.1",
	  port: "6379"
	}
};
```

[jwt]: https://jwt.io/
[redis]: https://redis.io/

## Contributing

Everyone is welcome to contribute, either by adding features, solving bugs or helping with documentation.
<br>
This project embraces [the open code of conduct][codeofconduct] from the [TODO group][todogroup], therefore all of its channels should respect its guidelines.
<br>

[codeofconduct]: http://todogroup.org/opencodeofconduct
[todogroup]: http://todogroup.org
