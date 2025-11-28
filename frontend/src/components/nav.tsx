import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const logoutUser = () => {
    axiosClient.post('/auth/logout')
      .then(() => {
        logout();
        navigate("/events");
      });
  }
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
          {
            isAuthenticated ? (
              <div className="flex gap-12">
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    `text-accent text-xl hover:font-bold transition-all ${isActive ? "underline underline-offset-4 decoration-2" : ""
                    }`
                  }
                >
                  Create
                </NavLink>
                <NavLink
                  to="/myEvents"
                  className={({ isActive }) =>
                    `text-accent text-xl hover:font-bold transition-all ${isActive ? "underline underline-offset-4 decoration-2" : ""
                    }`
                  }
                >
                  My Events
                </NavLink>
              </div>
            ) : ("")
          }
        </div>

        <div className="hidden lg:flex gap-4">
          {!isAuthenticated ? (
            <>
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
            </>
          ) :
            <>
              <button onClick={logoutUser}
                className="bg-red-500 text-amber-50 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          }
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
          {
            isAuthenticated ? (
              <div>
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    `text-accent text-xl hover:font-bold transition-all ${isActive ? "underline underline-offset-4 decoration-2" : ""
                    }`
                  }
                >
                  Create
                </NavLink>
                <NavLink
                  to="/myEvents"
                  className={({ isActive }) =>
                    `text-accent text-xl hover:font-bold transition-all ${isActive ? "underline underline-offset-4 decoration-2" : ""
                    }`
                  }
                >
                  My Events
                </NavLink>
              </div>

            ) : ("")
          }
          {!isAuthenticated ? (
            <>
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
            </>
          ) :
            <>
              <button onClick={logoutUser}
                className="bg-red-500 text-amber-50 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          }
        </div>
      )}
    </nav>
  );
}
