# Real Estate Listing Platform

A backend API for a real estate listing platform where
agents can post properties and users can browse and save properties.



## Table of Contents
- Features
- Tech Stack
- API Endpoints
- Authentication



## Features
- User registration and login (agent and regular user)
- Role-based access control
- Agents can add property listings
- Users can browse all properties
- Users can save favorite properties
- Pagination for efficient property listing
- MongoDB for data storage


## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- Multer or Cloudinary for image handling 
- Postman (for API testing)



## API Endpoints

### Auth Routes
### Method	Endpoint	    Description

    POST	/auth/register	Register new user
    POST	/auth/login  	Login user


### Property Routes
### Method	Endpoint	       Description

     GET	/properties	        Get all properties (paginated)
     GET	/properties/:id	    Get single property by ID
     POST	/properties	        Agent adds a new property


### Saved Properties
### Method	Endpoint	Description

    POST	/saved	    Save a property (user only)
    GET	    /saved	    Get saved properties



### Authentication
- JWT tokens are used for authentication.
- Include Authorization: Bearer <token> in protected routes.
- Users have roles: user or agent.

