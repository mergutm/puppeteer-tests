const API_UPDATE = "http://localhost:3000/api/books";


const params = new URLSearchParams(window.location.search);
document.getElementById("id").value = params.get("id");
document.getElementById("title").value = params.get("title");
document.getElementById("author").value = params.get("author");
document.getElementById("year").value = params.get("year");


document.getElementById("update-form").addEventListener("submit", async (e) => {
    e.preventDefault();


    const id = document.getElementById("id").value;


    const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        year: parseInt(document.getElementById("year").value)
    };


    await fetch(`${API_UPDATE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });


    window.location.href = "index.html";
});