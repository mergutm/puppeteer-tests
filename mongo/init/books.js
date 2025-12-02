db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || "librarydb");

db.createCollection("books");

db.books.insertMany([
  {
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    year: 1943
  },
  {
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    year: 1967
  },
  {
    title: "1984",
    author: "George Orwell",
    year: 1949
  },
  {
    title: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    year: 1605
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    year: 1953
  }
]);

print("MongoDB se inicializado con una colección 'books'.");
