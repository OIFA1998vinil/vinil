# Vinil &middot; [![Heroku App Status](http://heroku-shields.herokuapp.com/vinil-oifa)](https://vinil-oifa.herokuapp.com)

<div style="text-align:center;">
  <img src="https://raw.githubusercontent.com/doriandres/vinil/master/public/vinilLogo.png?token=AEVYYKXT5IMFHYC3CZIXUYK7EZJVW" width="200">
</div>

## Installation
Before running the project make sure you have installed all the dependencies.
```bash
$ cd /path/to/project
$ npm install
```
>Note: Make sure you have NodeJS installed and updated before running the previous command

## Running for development
For running in development you can simply run the following command:
```bash
$ npm run api && npm run web
```
After this you can use the application using `localhost:3000`.
>Note: You can run the api using Visual Studio Code Node JS debugger as well.


## Running for production
For running in a production like environment run this command:
```bash
$ npm run build && npm run api
```
After running this comand the application can be used at `localhost:8080`