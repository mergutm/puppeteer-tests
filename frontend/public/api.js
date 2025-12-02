//export const API_URL = "http://api:3000/api";
export const API_URL = "http://localhost:3000/api";


// Funciones para consumir la API de libros
export async function getBooks() {
    const res = await fetch(`${API_URL}/books`);
    return res.json();
}

export async function createBook(book) {
    const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
    });
    return res.json();
}

export async function updateBook(id, data) {
    const res = await fetch(`${API_URL}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function deleteBook(id) {
    const res = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE"
    });
    return res.json();
}
