import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from './components/Header'
import Home from './views/Home'
import Transfer from './views/Transfer'
import AddressBook from './views/AddressBook'

import 'antd/dist/antd.css';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">

        <BrowserRouter>
          <Header />

          <Routes>
            <Route path='/' element={<Home />} ></Route>
            <Route path='/transfer' element={<Transfer />}></Route>
            <Route path='/addressBook' element={<AddressBook />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
