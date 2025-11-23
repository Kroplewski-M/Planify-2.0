import { NavLink } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 -mt-16">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-6 text-accent">
          Login
        </h1>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-accent">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition cursor-pointer"
          >
            Login
          </button>
          <NavLink
            to={"/register"}
            className="text-center py-2 text-primary cursor-pointer"
          >
            Register instead
          </NavLink>
        </form>
      </div>
    </div>
  );
}
