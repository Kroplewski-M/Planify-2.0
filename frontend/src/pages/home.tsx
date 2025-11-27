import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full">
      <header className="py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 font-header text-accent">
            Planify
          </h1>
          <p className="text-lg mb-6">
            Create events, join events, and stay organized effortlessly.
          </p>

          <div className="flex justify-center gap-4">
            {
              isAuthenticated ? (<>
                <NavLink
                  to="/create"
                  className="px-6 py-3 bg-primary text-white rounded-2xl shadow hover:bg-primary/90 transition"
                >
                  Create Event
                </NavLink>
              </>) : (<></>)
            }
            <NavLink
              to="/events"
              className="px-6 py-3 bg-accent text-white rounded-2xl shadow hover:bg-accent/90 transition"
            >
              Go to Events
            </NavLink>
          </div>
        </div>
      </header>

      <section className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 features">
        <div className="p-6 bg-white shadow rounded-2xl">
          <h3 className="text-xl font-semibold mb-2 font-header text-accent">
            Create Your Event
          </h3>
          <p>
            Easily set up events with date, time, location, and invite friends
            with a click.
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded-2xl">
          <h3 className="text-xl font-semibold mb-2 font-header text-accent">
            Join Events
          </h3>
          <p>
            Find events you’re invited to or discover new ones happening near
            you.
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded-2xl">
          <h3 className="text-xl font-semibold mb-2 font-header text-accent">
            Stay Organized
          </h3>
          <p>
            Keep track of your upcoming events and never miss out on the fun.
          </p>
        </div>
      </section>
      <iframe
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}
          &q=29+Poplars+road+Barnsley`}>
      </iframe>
    </div>
  );
}
