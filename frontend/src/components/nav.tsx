
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-screen bg-primary shadow-md sticky top-0 z-50 flex items-center px-6 h-20">
      <div className="flex items-center justify-between w-full">
        <NavLink to="/" className="flex items-center cursor-pointer">
          <img src="/icon.svg" alt="Planify Logo" className="w-14" />
          <p className="font-header font-bold text-accent text-3xl pl-3">
            Planify
          </p>
        </NavLink>

        <button
          className="lg:hidden text-accent text-3xl cursor-pointer z-400"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>

        <div className="hidden lg:flex gap-10 ml-12 flex-1">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `text-accent text-xl hover:font-bold transition-all ${isActive ? "underline underline-offset-4 decoration-2" : ""
              }`
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              `text-accent text-xl hover:font-bold transition-all ${isActive ? "underline underline-offset-4 decoration-2" : ""
              }`
            }
          >
            Create
          </NavLink>
        </div>

        <div className="hidden lg:flex gap-4">
          <NavLink
            to="/register"
            className="bg-secondary text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Register
          </NavLink>
          <NavLink
            to="/login"
            className="bg-accent text-amber-50 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </NavLink>
        </div>
      </div>

      {open && (
        <div className="lg:hidden h-screen fixed top-0 right-0 bg-primary flex flex-col justify-center pb-6 w-full animate-fadeIn">
          <NavLink
            to="/events"
            onClick={() => setOpen(false)}
            className="text-accent text-xl px-2 mt-3"
          >
            Events
          </NavLink>

          <NavLink
            to="/create"
            onClick={() => setOpen(false)}
            className="text-accent text-xl px-2 mt-3"
          >
            Create
          </NavLink>

          <NavLink
            to="/register"
            onClick={() => setOpen(false)}
            className="bg-secondary text-primary px-4 py-3 rounded-lg font-semibold text-center mt-3"
          >
            Register
          </NavLink>

          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
            className="bg-accent text-amber-50 px-4 py-3 rounded-lg font-semibold text-center mt-3"
          >
            Login
          </NavLink>
        </div>
      )}
    </nav>
  );
}
