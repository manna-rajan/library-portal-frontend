import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const MyBorrows = () => {
    const [borrowings, setBorrowings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const readerId = sessionStorage.getItem("readerid");

    const fetchBorrowings = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/borrowings`, { readerId });
            if (response.data.status === 'success') {
                setBorrowings(response.data.data);
            } else {
                setError(response.data.message || 'Could not fetch borrowed books.');
            }
        } catch (err) {
            console.error("Error fetching borrowings:", err);
            setError('An error occurred while fetching your borrowed books.');
        }
    };

    useEffect(() => {
        if (!readerId) {
            navigate("/reader/signin");
            return;
        }
        fetchBorrowings();
    }, [readerId, navigate]);

    const handleReturn = async (borrowingId) => {
        setError('');
        try {
            const returnResponse = await axios.post(`${API_BASE_URL}/books/return`, { borrowingId, readerId });
            if (returnResponse.data.status === 'success') {
                if (returnResponse.data.data.totalFine > 0) {
                    navigate('/pay-fines');
                } else {
                    alert("Book returned successfully.");
                    fetchBorrowings();
                }
            }
        } catch (err) {
            console.error("Error returning book:", err);
            alert(err.response?.data?.message || "An error occurred while returning the book.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div className="container">
            <Nav />
            <div className="row mt-3">
                <div className="col-12">
                    <h2>My Borrowed Books</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {borrowings.length > 0 ? (
                        <div className="row g-3">
                            {borrowings.map((borrow) => (
                                <div key={borrow._id} className="col col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="card bg-secondary-subtle h-100">
                                        <div className="card-body d-flex flex-column">
                                            {borrow.bookId?.link && <img src={borrow.bookId.link} className="img-fluid rounded p-2 object-fit-contain" height="100" alt={borrow.bookId.title} />}
                                            <h5 className="card-title">{borrow.bookId?.title || 'Book title not available'}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">{borrow.bookId?.author || 'Author not available'}</h6>
                                            <p className="card-text">Due Date: {formatDate(borrow.dueDate)}</p>
                                            <button className="btn btn-warning mt-auto" onClick={() => handleReturn(borrow._id)}>Return Book</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (<p>You have not borrowed any books.</p>)}
                </div>
            </div>
        </div>
    );

};

export default MyBorrows;