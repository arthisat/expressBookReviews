const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // set const for username and password
    const username = req.body.username;
    const password = req.body.password;

    // if user already exists, update username
    if (username && password) {
        const userExists = users.some(user => user.username === username);

        // if user DNE, push new user
        if (!userExists) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered" });
        } else {
            return res.status(409).json({ message: "User already exists" });
        }
    }
    
    // if username + password DNE, indicate error
    return res.status(400).json({ message: "Username and password are required" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // send JSON response with formatted book list data
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // retrieve the ISBN param from the request URL and send specific book
    const isbn = req.params.isbn;
    return res.status(200).send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // set up author constant for comparison and empty array for returning
    const author = req.params.author;
    let filteredBooks = {};

    // check all books, if author matches, put the book in the filteredBooks array
    for (let isbn in books) {
        if (books[isbn].author === author) {
            filteredBooks[isbn] = books[isbn];
        }
    }

    return res.status(200).send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // set up title constant for comparison and empty array for returning
    const title = req.params.title;
    let filteredBooks = {};

    // check all books, if title matches, put the book in the filteredBooks array
    for (let isbn in books) {
        if (books[isbn].title === title) {
            filteredBooks[isbn] = books[isbn];
        }
    }

    return res.status(200).send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
