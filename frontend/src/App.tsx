import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import Login from "./pages/login";
import Nav from "./components/nav";
import Register from './pages/register';


function App() {
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
