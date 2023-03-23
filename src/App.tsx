import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from './components/Header'
import Home from './views/Home'

import 'antd/dist/antd.css';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Header />
        <Home />
      </div>
    </QueryClientProvider>
  );
}

export default App;
