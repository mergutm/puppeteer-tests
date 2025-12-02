const Book = require("../../models/Book");

module.exports = {
    // GET: listar libros
    getBooks: async (req, res) => {
        try {
            const books = await Book.find();
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener libros" });
        }
    },

    // POST: crear libro
    createBook: async (req, res) => {
        try {
            const { title, author, year } = req.body;
            const book = new Book({ title, author, year });
            await book.save();
            res.json(book);
        } catch (error) {
            res.status(400).json({ error: "Error al crear libro" });
        }
    },

    // PUT: actualizar libro
    updateBook: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await Book.findByIdAndUpdate(id, req.body, { new: true });
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: "Error al actualizar libro" });
        }
    },

    // DELETE: borrar libro
    deleteBook: async (req, res) => {
        try {
            const { id } = req.params;
            await Book.findByIdAndDelete(id);
            res.json({ message: "Libro eliminado" });
        } catch (error) {
            res.status(400).json({ error: "Error al borrar libro" });
        }
    }
};
