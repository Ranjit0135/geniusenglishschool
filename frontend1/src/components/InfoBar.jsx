import React, { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';
import api from '../api';

const InfoBar = () => {
    const [contactInfo, setContactInfo] = useState({
        location: "Naxal",
        phone: "+977"
    });

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await api.get('/public/navigation');
                if (response.data.school) {
                    setContactInfo({
                        location: response.data.school.address || "Naxal",
                        phone: response.data.school.phone || "+977"
                    });
                }
            } catch (error) {
                console.error('Failed to fetch contact info:', error);
            }
        };
        fetchInfo();
    }, []);

    return (
        <section className="bg-white py-2 hidden md:block">
            <div className="container mx-auto px-6 flex justify-end items-center gap-6">
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-500 text-[13px]">{contactInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <span className="text-gray-500 text-[13px]">{contactInfo.phone}</span>
                </div>
            </div>
        </section>
    );
};

export default InfoBar;
