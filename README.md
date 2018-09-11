# Node.js Master Class - homework assignment #1

This repo contains the code for homework assignment #1 of [The Node.js Master Class](https://pirple.thinkific.com/courses/the-nodejs-master-class).

## The Assignment:

Please create a simple "Hello World" API. Meaning:

1. It should be a RESTful JSON API that listens on a port of your choice. 

2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want. 

## Usage

Ensure you have node 8+ installed, and run: 

```
$ node index.js
```

### POST to /hello

```
$ curl localhost:3000/hello
```

#### Note on HTTPS

HTTPS is disabled by default.
To use HTTPS, update the add your certificate and private key files to the project and update `config.js`.

