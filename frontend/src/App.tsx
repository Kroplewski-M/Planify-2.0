import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import Login from "./pages/Auth/login";
import Nav from "./components/nav";
import Register from './pages/Auth/register';
import CreateEvent from './pages/Event/CreateEvent';
import { RequireAuth } from './components/RequiredAuth';
import EditEvent from './pages/Event/EditEvent';
import EventsPage from './pages/Event/Index';
import Event from './pages/Event/Event';

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Events" element={<EventsPage />} />
          <Route path="/Events/:id" element={<Event />} />
          <Route element={<RequireAuth />}>
            <Route path="/Create" element={<CreateEvent />} />
            <Route path="/Edit/:id" element={<EditEvent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
