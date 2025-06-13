// queries.js - MongoDB queries for plp_bookstore.books collection

// Task 2: Basic CRUD Operations
// Find all books in a specific genre (Fiction)
db.books.find({ genre: "Fiction" });

// Find books published after a certain year (1950)
db.books.find({ published_year: { $gt: 1950 } });

// Find books by a specific author (George Orwell)
db.books.find({ author: "George Orwell" });

// Update the price of a specific book (The Great Gatsby)
db.books.updateOne(
    { title: "The Great Gatsby" },
    { $set: { price: 10.49 } }
);

// Delete a book by its title (Animal Farm)
db.books.deleteOne({ title: "Animal Farm" });

// Task 3: Advanced Queries
// Find books that are both in stock and published after 2010
db.books.find({
    $and: [
        { in_stock: true },
        { published_year: { $gt: 2010 } }
    ]
});

// Use projection to return only title, author, and price
db.books.find(
    {},
    { title: 1, author: 1, price: 1, _id: 0 }
);

// Sort books by price ascending
db.books.find().sort({ price: 1 });

// Sort books by price descending
db.books.find().sort({ price: -1 });

// Pagination: 5 books per page, first page
db.books.find().skip(0).limit(5);

// Pagination: 5 books per page, second page
db.books.find().skip(5).limit(5);

// Task 4: Aggregation Pipeline
// Average price of books by genre
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" }
        }
    },
    {
        $sort: { averagePrice: -1 }
    }
]);

// Author with the most books
db.books.aggregate([
    {
        $group: {
            _id: "$author",
            bookCount: { $sum: 1 }
        }
    },
    {
        $sort: { bookCount: -1 }
    },
    {
        $limit: 1
    }
]);

// Group books by publication decade
db.books.aggregate([
    {
        $bucket: {
            groupBy: "$published_year",
            boundaries: [1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990],
            default: "1990+",
            output: {
                count: { $sum: 1 }
            }
        }
    }
]);

// Task 5: Indexing
// Create index on title
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Demonstrate performance with explain
db.books.find({ title: "The Great Gatsby" }).explain("executionStats");
db.books.find({ author: "George Orwell", published_year: { $gt: 1940 } }).explain("executionStats");