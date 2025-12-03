


    //const API_INSERT = "http://localhost:3000/api/books";
    const API_INSERT = "http://api:3000/api/books";
    

    document.getElementById("insert-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            year: parseInt(document.getElementById("year").value)
        };

        await fetch(API_INSERT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        window.location.href = "index.html";
    });
