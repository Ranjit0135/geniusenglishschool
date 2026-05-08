import Navbar from "../components/common/Navbar";
// import NoticeTicker from "../components/common/NoticeTicker";
import NoticePopup from "../components/common/NoticePopup";
import Hero from "../components/sections/Hero";
// import QuickInfoCards from "../components/sections/QuickInfoCards";
import AboutSection from "../components/sections/AboutSection";
import PrincipalMessage from "../components/sections/PrincipalMessage";
import HomeBlogSection from '../components/sections/HomeBlogSection';
import TestimonialsSection from "../components/sections/TestimonialsSection";
import GallerySection from "../components/sections/GallerySection";
import Footer from "../components/common/Footer";
import NewsUpdates from "../components/sections/NewsUpdates";
// Reverted to original NewsUpdates design.
import InfoBar from "../components/common/InfoBar";
import FloatingSocialIcons from "../components/common/FloatingSocialIcons";

const Home = () => {
    return (
        <div className="home">
            <FloatingSocialIcons />
            <NoticePopup />
            <InfoBar />
            <Navbar />
            {/* <NoticeTicker /> */}
            <Hero />
            {/* <QuickInfoCards /> */}
            <PrincipalMessage />
            <AboutSection />

            <NewsUpdates />

            <TestimonialsSection />
            <HomeBlogSection />
            <GallerySection />
            <Footer />
        </div>
    );
};

export default Home;
