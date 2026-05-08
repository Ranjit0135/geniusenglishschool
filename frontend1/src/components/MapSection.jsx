
const MapSection = () => {
    const mapUrl = "https://maps.app.goo.gl/rTKPUHtZHYu2ZGoh6";

    return (
        <section className="py-12 px-4 bg-white">
            <div className="container mx-auto max-w-[1140px] h-[450px] bg-white p-2 shadow-2xl">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="School Location"
                ></iframe>
            </div>
        </section>
    );
};

export default MapSection;
