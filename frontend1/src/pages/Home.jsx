import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import NewsSection from '../components/NewsSection';
import GallerySection from '../components/GallerySection';
import PartnersSection from '../components/PartnersSection';
import MapSection from '../components/MapSection';

const Home = () => {
    return (
        <main>
            <Hero />
            <AboutSection />
            <FeaturesSection />
            <NewsSection />
            <GallerySection />
            <PartnersSection />
            <MapSection />
        </main>
    );
};

export default Home;
