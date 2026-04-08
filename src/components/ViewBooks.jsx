import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const ViewBooks = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [isBorrowing, setIsBorrowing] = useState(false);
    const [error, setError] = useState('');
    const readerId = sessionStorage.getItem("readerid");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const filteredBooks = allBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
        setBooks(filteredBooks);
    }, [searchTerm, allBooks]);

    const fetchBooks = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/books`);
            setAllBooks(response.data);
            setBooks(response.data);
        } catch (err) {
            console.error("Error fetching books:", err);
            alert("Could not fetch books.");
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectBook = (book) => {
        setSelectedBooks(prevSelected => {
            if (prevSelected.find(b => b._id === book._id)) {
                return prevSelected.filter(b => b._id !== book._id);
            } else {
                return [...prevSelected, book];
            }
        });
    };

    const handleProceedToBorrow = async () => {
        if (!readerId) {
            navigate("/reader/signin");
            return;
        }

        if (selectedBooks.length === 0) {
            alert("Please select at least one book to borrow.");
            return;
        }

        setIsBorrowing(true);
        setError('');
        try {
            // Check for overdue books before allowing new borrowings.
            const borrowingsResponse = await axios.post(`${API_BASE_URL}/borrowings`, { readerId });
            const activeBorrowings = borrowingsResponse.data.data;
            const hasOverdueBooks = activeBorrowings.some(borrow => new Date(borrow.dueDate) < new Date());

            if (hasOverdueBooks) {
                alert("You have overdue books. Please return them before borrowing more.");
                navigate('/my-borrows');
                return;
            }

            const bookIds = selectedBooks.map(book => book._id);
            const response = await axios.post(`${API_BASE_URL}/books/borrow-multiple`, { readerId, bookIds });

            if (response.data.status === 'success') {
                alert(response.data.message);
                navigate("/my-borrows");
            } else {
                alert(response.data.message || "An unknown error occurred during borrowing.");
            }
        } catch (err) {
            console.error("Error borrowing books:", err);
            const errorMessage = err.response?.data?.message || "An error occurred during borrowing.";
            alert(errorMessage);
        } finally {
            setIsBorrowing(false);
        }
    };

    return (
        <div className="container">
            <Nav />
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <div className="row mt-3 align-items-center">
                <div className="col-md-8">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                {readerId && (
                    <div className="col-md-4 text-end">
                        <button className="btn btn-success" onClick={handleProceedToBorrow} disabled={selectedBooks.length === 0 || isBorrowing}>
                            {isBorrowing ? 'Processing...' : `Borrow Selected (${selectedBooks.length})`}
                        </button>
                    </div>
                )}
            </div>
            <div className="row g-3 mt-3">
                {books.map((book) => {
                    const isSelected = selectedBooks.some(b => b._id === book._id);
                    return (
                        <div key={book._id} className="col col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="card bg-secondary-subtle h-100">
                                <div className="card-body d-flex flex-column">
                                    <img src={book.link} className="img-fluid rounded p-2 object-fit-contain" height="100" alt={book.title} />
                                    <h5 className="card-title">{book.title}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                                    <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                                    <p className="card-text small text-body-secondary">{book.description.length > 100 ? `${book.description.substring(0, 100)}...` : book.description}</p>
                                    <p className="card-text">Available: {book.quantity}</p>
                                    {readerId && book.quantity > 0 && (
                                        <button
                                            className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'} mt-auto`}
                                            onClick={() => handleSelectBook(book)}
                                        >
                                            {isSelected ? 'Deselect' : 'Select'}
                                        </button>
                                    )}
                                    {readerId && book.quantity === 0 && (
                                        <button className="btn btn-light mt-auto" disabled>Out of Stock</button>
                                    )}
                                </div>
                            </div>
                        </div>);
                })}
            </div>
        </div>
    );
};

export default ViewBooks;