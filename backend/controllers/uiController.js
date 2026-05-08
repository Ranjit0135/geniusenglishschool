const { AboutContent, GalleryItem, School, HeroContent, Testimonial, PrincipalContent, ContactContent, Course } = require('../models');

// About Content
exports.getAboutContent = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;
        const about = await AboutContent.findOne({ where: { school_id } });
        res.json(about);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching about content' });
    }
};

exports.updateAboutContent = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const {
            title,
            description,
            mission,
            vision,
            tour_title,
            tour_description
        } = req.body;
        let about = await AboutContent.findOne({ where: { school_id } });

        const data = {
            school_id,
            title,
            description,
            mission,
            vision,
            tour_title,
            tour_description,
            image_url: req.files?.image ? req.files.image[0].path.replace(/\\/g, '/') : (about ? about.image_url : null),
            tour_image_url: req.files?.tour_image ? req.files.tour_image[0].path.replace(/\\/g, '/') : (about ? about.tour_image_url : null)
        };

        if (about) {
            await about.update(data);
        } else {
            about = await AboutContent.create(data);
        }

        res.json(about);
    } catch (error) {
        console.error('Error updating about content:', error);
        res.status(500).json({ message: 'Error updating about content' });
    }
};

// Gallery Items
exports.getGalleryItems = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;
        const items = await GalleryItem.findAll({
            where: { school_id },
            order: [['createdAt', 'DESC']]
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gallery items' });
    }
};

exports.createGalleryItem = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { title, description, media_type, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newItem = await GalleryItem.create({
            school_id,
            title,
            description,
            media_url: req.file.path.replace(/\\/g, '/'),
            media_type: media_type || 'image',
            category: category ? category.trim() : null
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating gallery item' });
    }
};

exports.deleteGalleryItem = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const item = await GalleryItem.findOne({ where: { id, school_id } });
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.destroy();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting gallery item' });
    }
};

exports.updateGalleryItem = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const { title, description, category } = req.body;
        const item = await GalleryItem.findOne({ where: { id, school_id } });

        if (!item) return res.status(404).json({ message: 'Item not found' });

        const updateData = {
            title,
            description,
            category: category ? category.trim() : null
        };

        if (req.file) {
            updateData.media_url = req.file.path.replace(/\\/g, '/');
        } else if (req.body.media_url) {
            updateData.media_url = req.body.media_url;
        }

        await item.update(updateData);
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error updating gallery item' });
    }
};

// Hero Section
exports.getHeroContent = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;
        let hero = await HeroContent.findOne({ where: { school_id } });

        if (!hero) {
            hero = await HeroContent.create({
                school_id,
                title_main: 'Genius English',
                title_highlight: 'School',
                subtitle: 'Welcome to',
                description: 'The best start for your child\'s education.',
                button_text: 'Take a Tour',
                button_link: '#tour'
            });
        }
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hero content' });
    }
};

exports.updateHeroContent = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        let hero = await HeroContent.findOne({ where: { school_id } });

        const updateData = {
            subtitle: req.body.subtitle,
            title_main: req.body.title_main,
            title_highlight: req.body.title_highlight,
            description: req.body.description,
            button_text: req.body.button_text,
            button_link: req.body.button_link,
            principal_name: req.body.principal_name,
            principal_role: req.body.principal_role,
            principal_message: req.body.principal_message,
            principal_facebook: req.body.principal_facebook,
            principal_twitter: req.body.principal_twitter,
            principal_linkedin: req.body.principal_linkedin,
            principal_instagram: req.body.principal_instagram,
            is_active: req.body.is_active === 'true' || req.body.is_active === true
        };

        if (req.files) {
            if (req.files.image) updateData.image_url = req.files.image[0].path.replace(/\\/g, '/');
            if (req.files.principal_image) updateData.principal_image_url = req.files.principal_image[0].path.replace(/\\/g, '/');
        } else if (req.file) {
            updateData.image_url = req.file.path.replace(/\\/g, '/');
        }

        // Safeguard for existing URLs from body
        if (!updateData.image_url && req.body.image_url) {
            updateData.image_url = req.body.image_url;
        }
        if (!updateData.principal_image_url && req.body.principal_image_url) {
            updateData.principal_image_url = req.body.principal_image_url;
        }

        if (hero) {
            await hero.update(updateData);
        } else {
            hero = await HeroContent.create({
                school_id,
                ...updateData
            });
        }
        res.json(hero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating hero content' });
    }
};
// School Settings
exports.getSchoolSettings = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const school = await School.findByPk(school_id);
        res.json(school);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching school settings' });
    }
};

exports.updateSchoolSettings = async (req, res) => {
    try {
        const school_id = req.user.school_id || (req.user.School ? req.user.School.id : null);

        if (!school_id) {
            return res.status(400).json({ message: 'No school associated with this user' });
        }

        const school = await School.findByPk(school_id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        const { name, subdomain, custom_domain, theme_config, template_id } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (subdomain !== undefined) updateData.subdomain = subdomain;
        if (custom_domain !== undefined) updateData.custom_domain = custom_domain;
        if (theme_config) updateData.theme_config = typeof theme_config === 'string' ? JSON.parse(theme_config) : theme_config;
        if (template_id) updateData.template_id = template_id;

        // Handle hero image uploads
        if (req.files) {
            const fields = [
                'general_hero', 'event_hero', 'blog_hero', 'gallery_hero',
                'news_hero', 'about_hero', 'contact_hero', 'school_life_hero',
                'courses_hero'
            ];

            fields.forEach(field => {
                if (req.files[field]) {
                    updateData[`${field}_image_url`] = req.files[field][0].path.replace(/\\/g, '/');
                }
            });
        }

        await school.update(updateData);
        res.json(school);
    } catch (error) {
        console.error('Update School Settings Error:', error);
        res.status(500).json({ message: 'Error updating school settings', error: error.message });
    }
};

// Finish Setup
exports.finishSetup = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const school = await School.findByPk(school_id);

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Update setup status to COMPLETED
        await school.update({ setup_status: 'COMPLETED' });

        res.json({
            message: 'Setup completed successfully',
            school
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error finishing setup' });
    }
};

// Super Admin: Get all schools for approval
exports.getAllSchools = async (req, res) => {
    try {
        const schools = await School.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(schools);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schools' });
    }
};

// Super Admin: Toggle school approval status
exports.toggleSchoolStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findByPk(id);
        if (!school) return res.status(404).json({ message: 'School not found' });

        // Toggle the status
        const nextStatus = !school.is_approved;
        await school.update({ is_approved: nextStatus });

        res.json({
            message: `School ${nextStatus ? 'approved' : 'access revoked'} successfully`,
            school
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating school status' });
    }
};

// Super Admin: Update school metadata (Administrative Override)
exports.adminUpdateSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subdomain } = req.body;
        const school = await School.findByPk(id);

        if (!school) return res.status(404).json({ message: 'School not found' });

        await school.update({
            name: name || school.name,
            subdomain: subdomain || school.subdomain
        });

        res.json({ message: 'School updated successfully', school });
    } catch (error) {
        res.status(500).json({ message: 'Error updating school metadata' });
    }
};

// Testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;
        const testimonials = await Testimonial.findAll({
            where: { school_id },
            order: [['createdAt', 'DESC']]
        });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonials' });
    }
};

exports.createTestimonial = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;

        if (!school_id) {
            return res.status(400).json({ message: 'School ID is required' });
        }

        const { author_name, author_role, content, rating, is_published } = req.body;

        const testimonial = await Testimonial.create({
            school_id,
            author_name,
            author_role: author_role || 'Parent',
            content,
            rating: parseInt(rating) || 5,
            is_published: is_published !== undefined ? (is_published === 'true' || is_published === true) : true,
            image_url: req.file ? req.file.path.replace(/\\/g, '/') : null
        });

        res.status(201).json(testimonial);
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ message: 'Error creating testimonial', error: error.message });
    }
};

exports.updateTestimonial = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const { author_name, author_role, content, rating, is_published } = req.body;
        const testimonial = await Testimonial.findOne({ where: { id, school_id } });

        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });

        const updateData = {
            author_name,
            author_role,
            content,
            rating: parseInt(rating) || 5,
        };

        if (is_published !== undefined) {
            updateData.is_published = (is_published === 'true' || is_published === true);
        }

        if (req.file) {
            updateData.image_url = req.file.path.replace(/\\/g, '/');
        } else if (req.body.image_url) {
            updateData.image_url = req.body.image_url;
        }

        await testimonial.update(updateData);
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating testimonial' });
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const testimonial = await Testimonial.findOne({ where: { id, school_id } });
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });

        await testimonial.destroy();
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial' });
    }
};

// Principal Message Section
exports.getPrincipalContent = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;
        let principal = await PrincipalContent.findOne({ where: { school_id } });

        if (!principal) {
            principal = await PrincipalContent.create({
                school_id,
                principal_name: 'Subodh Raimajhi',
                principal_role: 'Principal',
                principal_message: 'Education is not just about books; it\'s about building character and igniting a lifelong passion for learning in every child.',
                is_active: true
            });
        }
        res.json(principal);
    } catch (error) {
        console.error('Error fetching principal content:', {
            error: error.message,
            stack: error.stack,
            school_id: req.user?.school_id || req.school?.id
        });
        res.status(500).json({ message: 'Error fetching principal content', details: error.message });
    }
};

exports.updatePrincipalContent = async (req, res) => {
    try {
        const school_id = req.user?.school_id;

        if (!school_id) {
            console.error('Update Principal failed: school_id is missing from req.user');
            return res.status(400).json({ message: 'School ID is missing' });
        }

        let principal = await PrincipalContent.findOne({ where: { school_id } });

        const updateData = {
            principal_name: req.body.principal_name,
            principal_role: req.body.principal_role,
            principal_message: req.body.principal_message,
            is_active: req.body.is_active === 'true' || req.body.is_active === true
        };

        // Only update legacy URLs if they are provided in the body
        if (req.body.facebook_url !== undefined) updateData.facebook_url = req.body.facebook_url;
        if (req.body.twitter_url !== undefined) updateData.twitter_url = req.body.twitter_url;
        if (req.body.linkedin_url !== undefined) updateData.linkedin_url = req.body.linkedin_url;
        if (req.body.instagram_url !== undefined) updateData.instagram_url = req.body.instagram_url;

        let socialLinks = req.body.social_links ? (typeof req.body.social_links === 'string' ? JSON.parse(req.body.social_links) : req.body.social_links) : [];

        // Handle uploaded files
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');

                if (file.fieldname === 'principal_image') {
                    updateData.principal_image_url = normalizedPath;
                } else if (file.fieldname.startsWith('social_icon_')) {
                    const index = parseInt(file.fieldname.split('_')[2]);
                    if (socialLinks[index]) {
                        socialLinks[index].icon_url = normalizedPath;
                    }
                }
            });
        }

        updateData.social_links = socialLinks;

        if (principal) {
            await principal.update(updateData);
        } else {
            principal = await PrincipalContent.create({
                school_id,
                ...updateData
            });
        }
        res.json(principal);
    } catch (error) {
        console.error('Error updating principal content:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            user_school_id: req.user?.school_id
        });
        res.status(500).json({ message: 'Error updating principal content', details: error.message });
    }
};

// Contact Content
exports.getContactContent = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;
        let contact = await ContactContent.findOne({ where: { school_id } });

        if (!contact) {
            // Return default/empty if not found
            contact = {
                address: 'Sorakhutte, Kathmandu',
                email: 'contact@infinitewptheme.com',
                phone: '+977 9813990060',
                description: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
                hero_image_url: null
            };
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact content' });
    }
};

exports.updateContactContent = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { address, email, phone, map_url, description } = req.body;
        let contact = await ContactContent.findOne({ where: { school_id } });

        const data = {
            school_id,
            address,
            email,
            phone,
            map_url,
            description
        };

        if (req.file) {
            data.hero_image_url = req.file.path.replace(/\\/g, '/');
        }

        if (contact) {
            await contact.update(data);
        } else {
            contact = await ContactContent.create(data);
        }

        res.json(contact);
    } catch (error) {
        console.error('Error updating contact content:', error);
        res.status(500).json({ message: 'Error updating contact content' });
    }
};

// Courses
exports.getCourses = async (req, res) => {
    try {
        const school_id = req.user?.school_id || req.school?.id;
        const courses = await Course.findAll({
            where: { school_id },
            order: [['createdAt', 'DESC']]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const school_id = req.school?.id || req.user?.school_id;
        const course = await Course.findOne({
            where: { id, school_id }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { title, teacher, grade, description, sub_description, detailed_text, curriculum, category } = req.body;

        const course = await Course.create({
            school_id,
            title,
            teacher,
            grade,
            description,
            sub_description,
            detailed_text,
            curriculum: curriculum ? (typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum) : [],
            category,
            image_url: req.file ? req.file.path.replace(/\\/g, '/') : null
        });

        res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const { title, teacher, grade, description, sub_description, detailed_text, curriculum, category } = req.body;
        const course = await Course.findOne({ where: { id, school_id } });

        if (!course) return res.status(404).json({ message: 'Course not found' });

        const updateData = {
            title,
            teacher,
            grade,
            description,
            sub_description,
            detailed_text,
            curriculum: curriculum ? (typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum) : undefined,
            category
        };

        if (req.file) {
            updateData.image_url = req.file.path.replace(/\\/g, '/');
        } else if (req.body.image_url) {
            updateData.image_url = req.body.image_url;
        }

        await course.update(updateData);
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const course = await Course.findOne({ where: { id, school_id } });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        await course.destroy();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course' });
    }
};
