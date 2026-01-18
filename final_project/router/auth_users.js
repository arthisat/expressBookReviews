const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // returns true if user does NOT exist
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some (
        user => user.username === username && user.password === password
    );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).send({message: "Username and password required"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {username},
            "access",
            {expiresIn: "1h"}
        );
    
        req.session.authorization = {
            accessToken,
            username
        };
    
        return res.status(200).json({ message: "User successfully logged in" });
    }
    
    return res.status(401).json({ message: "Invalid username or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({message: "Review added/updated successfully" });
});

// delete a book review
regd_users.delete("/auth/review/:isbn",(req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "No review found for this user" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully" });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
