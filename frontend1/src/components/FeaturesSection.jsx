import { SwatchBook, Monitor, FileText, Bus, BookOpen, User, Star, Landmark } from 'lucide-react';

const iconMap = {
    'swing': SwatchBook,
    'laptop': Monitor,
    'doc': FileText,
    'govt': Landmark,
    'bus': Bus,
    'book': BookOpen,
    'user': User,
    'star': Star
};

const FeaturesSection = () => {
    const features = {
        title: "Why Genius English School?",
        description: "Genius English School is a top-ranked school in Nepal scoring top results every year in Board Examinations. It successfully blends tradition with a forward-thinking, international education philosophy that truly meets the needs of young children venturing into adulthood in an increasingly complex world.",
        items: [
            { icon: 'star', label: 'Holistic Development' },
            { icon: 'book', label: 'Academic Excellence' },
            { icon: 'user', label: 'Experienced Faculty' },
            { icon: 'govt', label: 'Approved by Ministry of Education Nepal ' }
        ]
    };

    return (
        <section className="py-8 px-4 bg-white">
            <div className="container mx-auto max-w-[1140px]">
                <div className="text-center mb-16">
                    <h2 className="section-title">{features.title}</h2>
                    <div className="section-divider"></div>
                    <p className="section-desc">{features.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.items.map((item, idx) => {
                        const Icon = iconMap[item.icon] || Star;
                        return (
                            <div key={idx} className="flex flex-col items-center text-center p-4 transition-transform duration-300 hover:-translate-y-2">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-sm border border-gray-100 text-[#192f59]">
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>
                                <p className="text-[13px] text-gray-500 font-bold leading-relaxed max-w-[180px]">{item.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
