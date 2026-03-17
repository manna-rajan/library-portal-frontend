import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const AdminBorrows = () => {
    const [borrowings, setBorrowings] = useState([]);
    const [fines, setFines] = useState([]);
    const [activeOverdue, setActiveOverdue] = useState([]);
    const [error, setError] = useState('');
    const [view, setView] = useState('active_borrows');
    const navigate = useNavigate();
    const adminId = sessionStorage.getItem("adminid");

    useEffect(() => {
        if (!adminId) {
            navigate("/admin/signin");
            return;
        }
        fetchBorrowings();
        fetchFines();
        fetchActiveOverdue();
    }, [adminId, navigate]);

    const fetchBorrowings = async () => {
        try {
            const response = await axios.post('http://localhost:3001/admin/borrowings');
            if (response.data.status === 'success') {
                setBorrowings(response.data.data);
            } else {
                setError(response.data.message || 'Could not fetch borrowings.');
            }
        } catch (err) {
            console.error("Error fetching all borrowings:", err);
            setError('An error occurred while fetching borrowings.');
        }
    };

    const fetchFines = async () => {
        try {
            const response = await axios.post('http://localhost:3001/admin/fines');
            if (response.data.status === 'success') {
                setFines(response.data.data);
            } else {
                setError(response.data.message || 'Could not fetch fines.');
            }
        } catch (err) {
            console.error("Error fetching all fines:", err);
            setError('An error occurred while fetching fines.');
        }
    };

    const fetchActiveOverdue = async () => {
        try {
            const response = await axios.post('http://localhost:3001/admin/calculate-active-fines');
            if (response.data.status === 'success') {
                setActiveOverdue(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (err) {
            console.error("Error fetching active overdue fines:", err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const activeBorrows = borrowings.filter(b => b.status === 'active');
    const paidFines = fines.filter(f => f.status === 'paid');
    const outstandingFines = fines.filter(f => f.status === 'outstanding');

    return (
        <div className="container">
            <Nav />
            <div className="row mt-3">
                <div className="col-12">
                    <h2>Admin Dashboard</h2>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="btn-group mb-4">
                        <button className={`btn ${view === 'active_borrows' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('active_borrows')}>
                            Active Borrows ({activeBorrows.length})
                        </button>
                        <button className={`btn ${view === 'paid_fines' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('paid_fines')}>
                            Paid Fines ({paidFines.length})
                        </button>
                        <button className={`btn ${view === 'current_fines' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('current_fines')}>
                            Current Fines ({outstandingFines.length + activeOverdue.length})
                        </button>
                    </div>

                    {view === 'active_borrows' && (
                        <div>
                            <h3>Active Borrowed Books</h3>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Book Title</th>
                                            <th>Reader</th>
                                            <th>Reader Email</th>
                                            <th>Borrow Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeBorrows.map(b => (
                                            <tr key={b._id}>
                                                <td>{b.bookId?.title || 'N/A'}</td>
                                                <td>{b.readerId?.name || 'N/A'}</td>
                                                <td>{b.readerId?.email || 'N/A'}</td>
                                                <td>{formatDate(b.borrowDate)}</td>
                                                <td>{formatDate(b.dueDate)}</td>
                                                <td><span className={`badge ${b.status === 'active' ? 'bg-warning' : 'bg-success'}`}>{b.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {view === 'paid_fines' && (
                        <div>
                            <h3>Paid Fines History</h3>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Reason</th>
                                            <th>Amount (₹)</th>
                                            <th>Reader</th>
                                            <th>Reader Email</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paidFines.map(f => (
                                            <tr key={f._id}>
                                                <td>{f.reason}</td>
                                                <td>{f.amount}</td>
                                                <td>{f.readerId?.name || 'N/A'}</td>
                                                <td>{f.readerId?.email || 'N/A'}</td>
                                                <td><span className={`badge ${f.status === 'paid' ? 'bg-success' : 'bg-danger'}`}>{f.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {view === 'current_fines' && (
                        <div>
                            <h3>Outstanding Fines (Unpaid)</h3>
                            <div className="table-responsive mb-5">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Reason</th>
                                            <th>Amount (₹)</th>
                                            <th>Reader</th>
                                            <th>Reader Email</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {outstandingFines.length > 0 ? outstandingFines.map(f => (
                                            <tr key={f._id}>
                                                <td>{f.reason}</td>
                                                <td>{f.amount}</td>
                                                <td>{f.readerId?.name || 'N/A'}</td>
                                                <td>{f.readerId?.email || 'N/A'}</td>
                                                <td><span className="badge bg-danger">{f.status}</span></td>
                                            </tr>
                                        )) : (<tr><td colSpan="5" className="text-center">No outstanding unpaid fines.</td></tr>)}
                                    </tbody>
                                </table>
                            </div>

                            <h3>Potential Fines (Active Overdue)</h3>
                            <div className="alert alert-info">
                                These fines are calculated based on today's date for books that have not yet been returned.
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Book Title</th>
                                            <th>Reader</th>
                                            <th>Due Date</th>
                                            <th>Days Overdue</th>
                                            <th>Est. Fine (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeOverdue.length > 0 ? activeOverdue.map((item, index) => (
                                            <tr key={item.borrowingId}>
                                                <td>{item.bookTitle}</td>
                                                <td>{item.readerName} <br /><small className="text-muted">{item.readerEmail}</small></td>
                                                <td>{formatDate(item.dueDate)}</td>
                                                <td>{item.daysOverdue}</td>
                                                <td className="text-danger fw-bold">₹{item.estimatedFine}</td>
                                            </tr>
                                        )) : (<tr><td colSpan="5" className="text-center">No active overdue books.</td></tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminBorrows