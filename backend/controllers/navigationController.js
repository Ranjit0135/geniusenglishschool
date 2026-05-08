const { School, NavigationItem } = require('../models');

// Fetch nested navigation items
exports.getNavigation = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const school = await School.findByPk(school_id);

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Fetch top-level items with their sub-items
        const navItems = await NavigationItem.findAll({
            where: {
                school_id,
                parent_id: null, // Top level items
                is_visible: true
            },
            include: [{
                model: NavigationItem,
                as: 'subItems',
                where: { is_visible: true },
                required: false,
                order: [['order', 'ASC']]
            }],
            order: [['order', 'ASC']]
        });

        res.json({
            school: {
                name: school.name,
                logo: school.logo_url,
                general_hero_image_url: school.general_hero_image_url,
                about_hero_image_url: school.about_hero_image_url,
                event_hero_image_url: school.event_hero_image_url,
                news_hero_image_url: school.news_hero_image_url,
                gallery_hero_image_url: school.gallery_hero_image_url,
                blog_hero_image_url: school.blog_hero_image_url,
                courses_hero_image_url: school.courses_hero_image_url,
                contact_hero_image_url: school.contact_hero_image_url,
                school_life_hero_image_url: school.school_life_hero_image_url,
                description: school.description,
                address: school.address,
                phone: school.phone,
                email: school.email,
                theme: school.theme_config
            },
            menu: navItems
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new navigation item
exports.createNavigation = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { label, path, order, parent_id, is_visible } = req.body;

        const newItem = await NavigationItem.create({
            school_id,
            label,
            path,
            order,
            parent_id: parent_id || null,
            is_visible: is_visible !== undefined ? is_visible : true
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating navigation item' });
    }
};

// Update a navigation item
exports.updateNavigation = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, path, order, parent_id, is_visible } = req.body;

        const item = await NavigationItem.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.update({ label, path, order, parent_id, is_visible });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating navigation item' });
    }
};

// Delete a navigation item
exports.deleteNavigation = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await NavigationItem.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.destroy();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting navigation item' });
    }
};

exports.updateSchoolLogo = async (req, res) => {
    try {
        const { name } = req.body;
        const school_id = req.user.school_id;

        const school = await School.findByPk(school_id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        const updateData = {};
        if (name) updateData.name = name;

        if (req.files) {
            if (req.files.logo) {
                updateData.logo_url = req.files.logo[0].path.replace(/\\/g, '/');
            }
            if (req.files.general_hero_image) {
                updateData.general_hero_image_url = req.files.general_hero_image[0].path.replace(/\\/g, '/');
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No data provided to update' });
        }

        await school.update(updateData);

        res.json({
            message: 'Branding updated successfully',
            name: school.name,
            logo_url: school.logo_url
        });
    } catch (error) {
        console.error('Branding update error:', error);
        res.status(500).json({ message: 'Failed to update branding' });
    }
};
