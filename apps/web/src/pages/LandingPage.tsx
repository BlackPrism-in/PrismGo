import { Link } from 'react-router';
import { Logo } from '../components/Logo';

const YEAR = new Date().getFullYear();

const STEPS = [
  {
    n: '1',
    title: 'Request',
    body: 'Pick pickup and drop from the map search, set the time and number of people. Done in a minute.',
  },
  {
    n: '2',
    title: 'Approve',
    body: 'Every HOD is notified. Any one of them approves or declines with one tap.',
  },
  {
    n: '3',
    title: 'Assign',
    body: 'The transport desk sees which vehicles and drivers are free and assigns them.',
  },
  {
    n: '4',
    title: 'Track',
    body: 'The driver gets the trip on WhatsApp. GPS starts and ends the trip, and you follow it live.',
  },
];

const ROLES = [
  { name: 'Requesters', body: 'Book a vehicle, see who is driving, and track it to the door.' },
  { name: 'HODs', body: 'Approve or decline requests from the app or the web.' },
  {
    name: 'Transport desk',
    body: 'Dispatch, live map of every vehicle, and the vehicle and driver lists.',
  },
  { name: 'Admins', body: 'Decide who has which role; block access in one click.' },
];

/** Public home page for visitors who are not logged in. */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo className="text-2xl" />
        <Link
          to="/login"
          className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-ink hover:bg-coral-600"
        >
          Log in
        </Link>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-8 pb-16 md:grid-cols-2 md:pt-16">
          <div>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Office vehicles, requested, approved and tracked in one place.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sand-600">
              PrismGo replaces phone calls and spreadsheets for company cars. Staff request a
              vehicle, an HOD approves, the transport desk assigns a car and driver, and everyone
              follows the trip live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-lg bg-coral-500 px-5 py-3 font-medium text-ink hover:bg-coral-600"
              >
                Log in with WhatsApp
              </Link>
              <a
                href="#how-it-works"
                className="rounded-lg border border-sand-300 bg-white px-5 py-3 font-medium hover:border-coral-500"
              >
                How it works
              </a>
            </div>
            <p className="mt-4 text-sm text-sand-500">
              No password: log in with your mobile number and a code sent on WhatsApp.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <img
              src="/landing/request.jpg"
              alt="Requesting a vehicle in PrismGo"
              className="w-44 rounded-2xl border border-sand-200 shadow-lg sm:w-56"
            />
            <img
              src="/landing/trip.jpg"
              alt="A request with its vehicle and driver"
              className="mt-10 w-44 rounded-2xl border border-sand-200 shadow-lg sm:w-56"
            />
          </div>
        </section>

        <section id="how-it-works" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-xl border border-sand-200 bg-sand-50 p-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-300 font-semibold">
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-sand-600">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <img
            src="/landing/dispatch.jpg"
            alt="The transport desk's dispatch screen"
            className="w-full rounded-xl border border-sand-200 shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold">Built for every role</h2>
            <ul className="mt-6 space-y-4">
              {ROLES.map((r) => (
                <li key={r.name}>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-sand-600">{r.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-sand-600">
              Works on Android and on the web. Drivers need nothing installed: trips reach them on
              WhatsApp.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-sand-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-sand-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} BlackPrism Private Limited ·{' '}
            <a href="https://blackprism.in" className="hover:text-coral-700">
              blackprism.in
            </a>
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            <a href="/privacy.html" className="hover:text-coral-700">
              Privacy
            </a>
            <a href="/terms.html" className="hover:text-coral-700">
              Terms
            </a>
            <a href="/privacy.html#delete-data" className="hover:text-coral-700">
              Delete your data
            </a>
            <a href="mailto:admin@blackprism.in" className="hover:text-coral-700">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
