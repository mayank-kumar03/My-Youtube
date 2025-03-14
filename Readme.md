*Upgraded version of youtube*
# Video Wallaha Application Backend

## Overview

This project is the backend for a YouTube-like application, providing a comprehensive set of features that allow users to register, log in, manage their profiles, and interact with video content. The backend is built using Node.js, Express, and MongoDB, and it utilizes JWT for authentication and Cloudinary for image uploads.

## Features

- **User Registration**: Users can create an account by providing their full name, email, username, and password. Avatar and cover images can also be uploaded during registration.
- **User Login**: Users can log in using their username or email and password. Access and refresh tokens are generated upon successful login.
- **User Logout**: Users can log out, which clears their refresh token and access token cookies.
- **Token Refresh**: Users can refresh their access token using a valid refresh token.
- **Change Password**: Users can change their current password after verifying their old password.
- **Update Account Details**: Users can update their full name and email address.
- **Update Avatar and Cover Image**: Users can update their avatar and cover image.
- **Get User Channel Profile**: Users can view their channel profile, including subscriber counts and subscription status.
- **Watch History**: Users can retrieve their watch history, including details about the videos watched.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user and video data.
- **Mongoose**: ODM for MongoDB to manage data models.
- **Cloudinary**: Cloud service for image and video uploads.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Multer**: Middleware for handling file uploads.
-[Models link](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbEgzNUtaOHF6bU4zUzdzSDNIY1JwSDczRXk1UXxBQ3Jtc0tuNjU3VTc5MTVhdnJaeXRVM1U3UElTQldKZXk4STI4Y2hpME42dUh2TnJxc3ZJa19uX1IxTmpBcHBHNy00amJnYlJWNGRVd1hMbHgzRkNMNllBMG11a2dhWHFYZWJIb0ptVXp1VmcweE4xb0V5dW1Lcw&q=https%3A%2F%2Fapp.eraser.io%2Fworkspace%2FYtPqZ1VogxGy1jzIDkzj%3Forigin%3Dshare&v=9B4CvtzXRpc)
