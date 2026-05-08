import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import InfoBar from './components/InfoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BeyondAcademics from './pages/BeyondAcademics';
import Gallery from './pages/Gallery';
import NewsEvents from './pages/NewsEvents';
import About from './pages/About';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import NewsDetails from './pages/NewsDetails';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* <InfoBar /> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beyond-academics" element={<BeyondAcademics />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news-events" element={<NewsEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/news/:slug" element={<NewsDetails />} />
          <Route path="/event/:slug" element={<EventDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
