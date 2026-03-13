import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ViewBooks from './components/ViewBooks';
import MyBorrows from './components/MyBorrows';
import PayFines from './components/PayFines';
import Adminsignup from './components/Adminsignup';
import Adminsignin from './components/Adminsignin';
import Readersignup from './components/Readersignup';
import Readersignin from './components/Readersignin';
import AdminBorrows from './components/AdminBorrows';
import AddBook from './components/AddBook';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ViewBooks />} />
        <Route path='/view' element={<ViewBooks />} />
        <Route path='/my-borrows' element={<MyBorrows />} />
        <Route path='/pay-fines' element={<PayFines />} />
        <Route path='/admin/borrows' element={<AdminBorrows />} />
        <Route path='/reader/signin' element={<Readersignin />} />
        <Route path='/reader/signup' element={<Readersignup />} />
        <Route path='/admin/signin' element={<Adminsignin />} />
        <Route path='/admin/signup' element={<Adminsignup />} />
        <Route path='/add-book' element={<AddBook />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
