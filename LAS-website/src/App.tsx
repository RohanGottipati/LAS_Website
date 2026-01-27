
import './App.css'

function App() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">LAS</span>
          <span className="brand-text">Club</span>
        </div>
        <nav className="nav">
          <a href="#about" className="nav-link">About</a>
          <a href="#team" className="nav-link">Team</a>
          <a href="#events" className="nav-link">Events</a>
          <a href="#future-events" className="nav-link">Future Events</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </nav>
      </header>

      <main className="content">
        <section id="about" className="section">
          <h1>About LAS Club</h1>
          <p>
            We are a student-led club focused on learning, collaboration, and
            community impact through projects, workshops, and events.
          </p>
        </section>

        <section id="team" className="section">
          <h2>Team</h2>
          <p>
            Meet the leaders and members who organize activities, mentor new
            members, and keep the club moving forward.
          </p>
        </section>

        <section id="events" className="section">
          <h2>Events</h2>
          <p>
            From guest speakers to hands-on sessions, our events help members
            grow skills and build connections.
          </p>
        </section>

        <section id="future-events" className="section">
          <h2>Future Events</h2>
          <p>
            Keep an eye out for upcoming workshops, social meetups, and
            community projects planned for this semester.
          </p>
        </section>

        <section id="faq" className="section">
          <h2>FAQ</h2>
          <p>
            Have questions about membership, schedules, or how to join?
            We have answers and would love to hear from you.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
