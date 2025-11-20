import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-screen h-20 bg-primary shadow-md sticky top-0 z-50 flex items-center px-6">
      <a href="/" className="flex items-center cursor-pointer">
        <img src="/icon.svg" alt="Planify Logo" className="w-16" />
        <p className="font-header font-bold text-accent text-3xl pl-3">
          Planify
        </p>
      </a>

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
          to="/events/create"
          className={({ isActive }) =>
            `text-accent text-xl hover:font-bold transition-all ${
              isActive ? "underline underline-offset-4 decoration-2" : ""
            }`
          }
        >
          Create
        </NavLink>
      </div>
    </nav>
  );
}