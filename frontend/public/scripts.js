

const API_URL = "http://api:3000/api/books";

async function loadBooks() {
  const res = await fetch(API_URL);
  const books = await res.json();
  const tbody = document.getElementById("books-table-body");
  tbody.innerHTML = "";

  books.forEach(book => {
    console.log(book);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year}</td>
      <td>
        <a href="update.html?id=${book._id}&title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&year=${book.year}" class="text-primary me-3">
          <i class="fa-solid fa-pen-to-square"></i>
        </a>
        <button class="btn btn-link text-danger p-0" onclick="deleteBook('${book._id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function deleteBook(id) {
  if (!confirm("¿Eliminar este libro?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadBooks();
}
window.onload = function () {
  console.log("window.onload: The entire page and all resources are fully loaded.");
  loadBooks();
}