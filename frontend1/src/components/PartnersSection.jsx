import '../index.css'; // Ensure we have the keyframes if in css, or add style tag

const PartnersSection = () => {
    const partners = {
        title: "Our Partners",
        subtitle: "Collaborating for excellence in education.",
        items: [
            { name: "British Council", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/British_Council_Logo.svg/1200px-British_Council_Logo.svg.png" },
            { name: "Cambridge Assessment International Education", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Cambridge_Assessment_International_Education_logo.svg/1200px-Cambridge_Assessment_International_Education_logo.svg.png" },
            { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
            { name: "Google for Education", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" }
        ]
    };

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto max-w-[1140px] text-center mb-12">
                <h2 className="section-title">{partners.title}</h2>
                <div className="section-divider"></div>
                <p className="font-bold text-gray-500">{partners.subtitle}</p>
            </div>

            <div className="relative w-full overflow-hidden mask-linear-gradient">
                <div className="flex w-max animate-scroll">
                    {[...partners.items, ...partners.items, ...partners.items].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-center min-w-[200px] px-8">
                            <img
                                src={item.logo}
                                alt={item.name}
                                className="h-12 w-auto grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .animate-scroll {
                    animation: scroll-partners 40s linear infinite;
                }
                .mask-linear-gradient {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
                @keyframes scroll-partners {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
};

export default PartnersSection;
