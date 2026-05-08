import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import Events from './pages/Events';
import BlogDetails from './pages/BlogDetails';
import NewsDetails from './pages/NewsDetails';
import EventDetails from './pages/EventDetails';
import News from './pages/News';
import Gallery from './pages/Gallery';
import CourseDetails from './pages/CourseDetails';
// import SchoolLife from './pages/SchoolLife';
import SubmitTestimonial from './pages/SubmitTestimonial';

import Login from './pages/Login';
import AccessGate from './components/common/AccessGate';
import GuestRoute from './components/common/GuestRoute';

// Admin Dash Components
import AdminDashboard from './school-management/pages/AdminDashboard';
import DashboardLayout from './school-management/components/DashboardLayout';
import ManageLogo from './school-management/pages/website-management/ManageLogo';
import ManageMenuItems from './school-management/pages/website-management/ManageMenuItems';
import ManageAbout from './school-management/pages/website-management/ManageAbout';
import ManageGallery from './school-management/pages/website-management/ManageGallery';
import ManageBlogs from './school-management/pages/website-management/ManageBlogs';
import BlogForm from './school-management/pages/website-management/BlogForm';
import ManageNews from './school-management/pages/website-management/ManageNews';
import NewsForm from './school-management/pages/website-management/NewsForm';
import ManageEvents from './school-management/pages/website-management/ManageEvents';
import EventForm from './school-management/pages/website-management/EventForm';
import ManageHero from './school-management/pages/website-management/ManageHero';
import ManagePrincipal from './school-management/pages/website-management/ManagePrincipal';
import ManageTestimonials from './school-management/pages/website-management/ManageTestimonials';
import ManageSocialLinks from './school-management/pages/website-management/ManageSocialLinks';
import ManageContact from './school-management/pages/website-management/ManageContact';
import ManageCourses from './school-management/pages/website-management/ManageCourses';
import AccountSettings from './school-management/pages/website-management/AccountSettings';
import Navbar from './components/common/Navbar';

function App() {
  return (

    <Routes>

      {/* Public Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/news" element={<News />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetails />} />
      <Route path="/news/:slug" element={<NewsDetails />} />
      <Route path="/event/:slug" element={<EventDetails />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route path="/events" element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      {/* <Route path="/school-life" element={<SchoolLife />} /> */}
      <Route path="/submit-testimonial" element={<SubmitTestimonial />} />

      {/* Auth Routes */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

      {/* Simplified Dashboard Redirect */}
      <Route
        path="/dashboard/*"
        element={<Navigate to="/school-admin" replace />}
      />

      {/* Main School Management Routes */}
      <Route
        path="/school-admin/*"
        element={
          <AccessGate>
            <DashboardLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />

                {/* Internal CMS / Website Management */}
                <Route path="website/logo" element={<ManageLogo />} />
                <Route path="website/menu" element={<ManageMenuItems />} />
                <Route path="website/about" element={<ManageAbout />} />
                <Route path="website/gallery" element={<ManageGallery />} />
                <Route path="website/blogs" element={<ManageBlogs />} />
                <Route path="website/blog/add" element={<BlogForm />} />
                <Route path="website/blog/edit/:id" element={<BlogForm />} />
                <Route path="website/news" element={<ManageNews />} />
                <Route path="website/news/add" element={<NewsForm />} />
                <Route path="website/news/edit/:id" element={<NewsForm />} />
                <Route path="website/events" element={<ManageEvents />} />
                <Route path="website/event/add" element={<EventForm />} />
                <Route path="website/event/edit/:id" element={<EventForm />} />

                <Route path="website/hero" element={<ManageHero />} />
                <Route path="website/principal" element={<ManagePrincipal />} />
                <Route path="website/testimonials" element={<ManageTestimonials />} />
                <Route path="website/contact" element={<ManageContact />} />
                <Route path="website/courses" element={<ManageCourses />} />
                <Route path="website/social-links" element={<ManageSocialLinks />} />
                <Route path="website/account-settings" element={<AccountSettings />} />

                {/* Fallback for sub-routes */}
                <Route path="*" element={<Navigate to="/school-admin" replace />} />
              </Routes>
            </DashboardLayout>
          </AccessGate>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
