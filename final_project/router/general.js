const express = require('express');
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");
const publicUsersRouter = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

publicUsersRouter.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "Registration successful." });
    } else {
      return res.status(404).json({ message: "User already exists." });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

publicUsersRouter.get('/', (req, res) => {
  res.send(JSON.stringify(books, null, 4));
});

publicUsersRouter.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});

publicUsersRouter.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter((book) => book.author === author);
  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).json({ message: "No books found for the author." });
  }
});

publicUsersRouter.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const booksWithTitle = Object.values(books).filter((book) => book.title === title);
  if (booksWithTitle.length > 0) {
    res.send(JSON.stringify(booksWithTitle, null, 4));
  } else {
    res.status(404).json({ message: "No books found with the title." });
  }
});

publicUsersRouter.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book && book.reviews) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book reviews not found." });
  }
});

function getBookList() {
  return Promise.resolve(books);
}

publicUsersRouter.get('/', (req, res) => {
  getBookList()
    .then((bk) => res.send(JSON.stringify(bk, null, 4)))
    .catch((error) => res.send("error"));
});

function getFromISBN(isbn) {
  const book = books[isbn];
  if (book) {
    return Promise.resolve(book);
  } else {
    return Promise.reject("Book not found.");
  }
}

publicUsersRouter.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  getFromISBN(isbn)
    .then((bk) => res.send(JSON.stringify(bk, null, 4)))
    .catch((error) => res.send(error));
});

function getFromAuthor(author) {
  const output = Object.values(books).filter((book) => book.author === author);
  return Promise.resolve(output);
}

publicUsersRouter.get('/author/:author', (req, res) => {
  const author = req.params.author;
  getFromAuthor(author)
    .then((result) => res.send(JSON.stringify(result, null, 4)));
});

function getFromTitle(title) {
  const output = Object.values(books).filter((book) => book.title === title);
  return Promise.resolve(output);
}

publicUsersRouter.get('/title/:title', (req, res) => {
  const title = req.params.title;
  getFromTitle(title)
    .then((result) => res.send(JSON.stringify(result, null, 4)));
});

module.exports.general = publicUsersRouter;
