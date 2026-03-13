import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const readerId = sessionStorage.getItem("readerid");
  const adminId = sessionStorage.getItem("adminid");
  const isLoggedIn = readerId || adminId;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/reader/signin');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-primary rounded border border-warning-emphasis shadow-sm" data-bs-theme="dark">
        <div className="container-fluid ">
          <Link className="navbar-brand fw-bold text-white-emphasis outline-warning-emphasis" to="/">Library Portal</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav  ms-auto gap-2 px-3">
              <Link className="btn btn-outline-warning text-white-emphasis rounded-pill  " to="/view">View All Books</Link>
              {isLoggedIn ? (
                <>
                  {readerId && <Link className="btn  btn-outline-warning text-white-emphasis  rounded-pill " to="/my-borrows">My Borrows</Link>}
                  {adminId && <Link className="btn  btn-outline-warning text-white-emphasis  rounded-pill " to="/add-book">Add Book</Link>}
                  {adminId && <Link className="btn  btn-outline-warning text-white-emphasis  rounded-pill " to="/admin/borrows">Admin Dashboard</Link>}
                  <button className="btn  btn-outline-danger text-white-emphasis  rounded-pill  " onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <Link className="btn btn-outline-info text-white-emphasis rounded-pill " to="/reader/signin">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav