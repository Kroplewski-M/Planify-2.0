import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-screen h-20 bg-primary shadow-md sticky top-0 z-50 flex items-center px-6">
      <NavLink to="/" className="flex items-center cursor-pointer">
        <img src="/icon.svg" alt="Planify Logo" className="w-16" />
        <p className="font-header font-bold text-accent text-3xl pl-3">
          Planify
        </p>
      </NavLink>

      <div className="flex gap-10 ml-12 flex-1">
        <NavLink
          to="/events"
          className={({ isActive }) =>
            `text-accent text-xl hover:font-bold transition-all ${
              isActive ? "underline underline-offset-4 decoration-2" : ""
            }`
          }
        >
          Events
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            `text-accent text-xl hover:font-bold transition-all ${
              isActive ? "underline underline-offset-4 decoration-2" : ""
            }`
          }
        >
          Create
        </NavLink>
      </div>
      <div className="flex gap-4">
         <NavLink
          to="/register"
          className="bg-secondary text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
          Register
        </NavLink>
        <NavLink
          to="/login"
          className="bg-accent text-amber-50 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
            Login
        </NavLink>
      </div>
    </nav>
  );
}