const express = require("express");
const router = express.Router();
const controller = require("./controllers/booksController");

// CRUD 4 rutas para libros
router.get("/books", controller.getBooks);
router.post("/books", controller.createBook);
router.put("/books/:id", controller.updateBook);
router.delete("/books/:id", controller.deleteBook);

module.exports = router;
