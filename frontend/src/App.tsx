import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import Login from "./pages/login";
import Nav from "./components/nav";
import Register from './pages/register';

function App() {
  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then(res => res)
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
