const Navigation = require('../models/Navigation');
const GlobalSetting = require('../models/GlobalSetting');
const path = require('path');
const fs = require('fs');

// --- Navigation Item Management ---

exports.getNavigation = async (req, res) => {
    try {
        const school = await GlobalSetting.findOne();
        const items = await Navigation.findAll({
            where: { is_visible: true },
            order: [['order', 'ASC']]
        });

        // Organize into hierarchy
        const menuHierarchy = items.filter(item => !item.parent_id).map(parent => {
            const subItems = items.filter(child => child.parent_id === parent.id);
            return {
                ...parent.toJSON(),
                subItems: subItems.map(s => s.toJSON())
            };
        });

        res.json({
            school: {
                name: school?.schoolName,
                logo: school?.logoUrl
            },
            menu: menuHierarchy
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllNavigationAdmin = async (req, res) => {
    try {
        const items = await Navigation.findAll({
            order: [['order', 'ASC']]
        });

        // Return full hierarchy for admin management
        const menuHierarchy = items.filter(item => !item.parent_id).map(parent => {
            const subItems = items.filter(child => child.parent_id === parent.id);
            return {
                ...parent.toJSON(),
                subItems: subItems.map(s => s.toJSON())
            };
        });

        res.json(menuHierarchy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createNavigation = async (req, res) => {
    try {
        const newItem = await Navigation.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateNavigation = async (req, res) => {
    try {
        const item = await Navigation.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.update(req.body);
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteNavigation = async (req, res) => {
    try {
        const item = await Navigation.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Unlink children if any
        await Navigation.update({ parent_id: null }, { where: { parent_id: item.id } });

        await item.destroy();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Identity / School Branding Management ---

exports.updateSchoolBranding = async (req, res) => {
    try {
        let school = await GlobalSetting.findOne();
        if (!school) {
            school = await GlobalSetting.create({});
        }

        const updates = {};
        if (req.body.name) updates.schoolName = req.body.name;

        if (req.file) {
            // Delete old logo if it exists
            if (school.logoUrl) {
                const oldPath = path.join('uploads', school.logoUrl);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updates.logoUrl = req.file.filename;
        }

        await school.update(updates);
        res.json({ message: 'Branding updated', school });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
