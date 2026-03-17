import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';

const PayFines = () => {
    const [fines, setFines] = useState({ total: 0, records: [] });
    const [isPaying, setIsPaying] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const readerId = sessionStorage.getItem("readerid");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const orderId = urlParams.get('order_id');

        const verifyPaymentOnBackend = async (orderIdToVerify) => {
            setIsVerifying(true);
            try {
                const response = await axios.post('http://localhost:3001/verify-payment', {
                    order_id: orderIdToVerify,
                    readerId,
                });

                if (response.data.status === 'success' && response.data.data.order_status === 'PAID') {
                    alert("Payment successful! Your fines have been cleared.");
                    navigate('/my-borrows', { replace: true });
                } else {
                    alert(response.data.data.order_status || "Payment could not be confirmed. Please try again.");
                    navigate('/pay-fines', { replace: true });
                }
            } catch (err) {
                alert(err.response?.data?.message || "An error occurred during payment verification.");
                navigate('/pay-fines', { replace: true });
            }
        };

        const initialFetchFines = async () => {
            try {
                const response = await axios.post('http://localhost:3001/fines', { readerId });
                if (response.data.status === 'success') {
                    // If a user lands here with no fines, and we are not verifying a payment, send them to my-borrows.
                    if (response.data.total === 0 && !orderId) {
                        navigate('/my-borrows');
                    } else {
                        setFines({ total: response.data.total, records: response.data.data });
                    }
                } else {
                    setError(response.data.message || 'Could not fetch fines.');
                }
            } catch (err) {
                console.error("Error fetching fines:", err);
                setError('An error occurred while fetching your fines.');
            }
        };

        if (!readerId) {
            navigate("/reader/signin");
            return;
        }

        if (orderId) {
            verifyPaymentOnBackend(orderId);
        } else {
            initialFetchFines();
        }
    }, [location.search, readerId, navigate]);

    const handlePayment = async () => {
        setIsPaying(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/create-payment-order', { readerId });

            if (response.data.status === 'success') {
                const { payment_session_id } = response.data.data;
                const cashfree = window.Cashfree({ mode: "sandbox" });

                cashfree.checkout({
                    paymentSessionId: payment_session_id,
                    redirectTarget: "_self"
                });

            } else {
                alert(response.data.message || "Could not initiate payment.");
            }
        } catch (err) {
            console.error("Error during payment initiation:", err);
            alert(err.response?.data?.message || "An error occurred while starting the payment process.");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="container">
            <Nav />
            <div className="row mt-3">
                <div className="col-12">
                    <h2>Pay Outstanding Fines</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">My Fines</h4>
                            <p>Total Outstanding Fine: <strong>₹{fines.total}</strong></p>
                            {(fines.total > 0 || isVerifying || isPaying) ? (
                                <>
                                    <button className="btn btn-success mb-3" onClick={handlePayment} disabled={isPaying || isVerifying}>
                                        {(isPaying || isVerifying) ? 'Processing...' : `Pay ₹${fines.total} Now`}
                                    </button>
                                    <h5>Fine Details:</h5>
                                    <ul className="list-group">
                                        {fines.records.map(fine => (
                                            <li key={fine._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                {fine.reason}
                                                <span className="badge bg-danger rounded-pill">₹{fine.amount}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p>You have no outstanding fines.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayFines;
