# Allstar Code Challenge Backend
Created by Joseph Harwood

#Description:

This is the backend for Allstars Code Challenge. These were the instructions.

You will use Node.JS, MongoDb to create an API for an end user application. The
application will have users who work for Allstar and supply their working hours to the API.
An admin of the application will be able to query who worked between specified
times and read through notes supplied by the user.The user will be able to supply a finish
time and a time worked in seconds, the backend will calculate their start time and store it
as a date in the work document.

#User Stories:
As a user I want to sign up with my Email.
As a user I want to create my work document.
As a user I will supply my finish time & time worked in seconds.
As a user I will be able to add notes to my work document.
As a user I want to see, update, delete my documents.
#Admin Stories:
As an admin I want to see all my users.
As an admin I want to see who worked between specific times.
As an admin I want to be able to read the notes and search for a word.

#Instructions

1) In order to run this, within the root directory make sure to install dependencies by opening
the terminal and typing the following:

  npm install

2) Make sure you have MongoDB installed and run Mongodb:
https://treehouse.github.io/installation-guides/mac/mongo-mac.html

  mongod

3) Start the application:

  npm start
