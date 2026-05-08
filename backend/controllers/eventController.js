const { Event, School } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Helper to generate slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + uuidv4().slice(0, 8);
};

exports.getAllEvents = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const events = await Event.findAll({
            where: { school_id },
            order: [['date', 'ASC']]
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event' });
    }
};

exports.getEventBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const event = await Event.findOne({ where: { slug } });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        console.log('--- CREATE EVENT TRACE ---');
        console.log('File:', req.file);
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        const school_id = req.user.school_id;
        const { title, description, date, time_range, location, is_published, category } = req.body;

        // Handle uploaded files
        let image_url = null;

        if (req.files) {
            req.files.forEach(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');
                if (file.fieldname === 'image') image_url = normalizedPath;
            });
        }

        // Handle URL strings if provided instead of files
        if (!image_url && req.body.image_url) image_url = req.body.image_url;

        const newEvent = await Event.create({
            school_id,
            title,
            slug: generateSlug(title),
            description,
            date,
            time_range,
            location,
            category,
            is_published: is_published === 'false' || is_published === false ? false : true,
            image_url
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        console.log('--- UPDATE EVENT TRACE ---');
        console.log('File:', req.file);
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        const school_id = req.user.school_id;
        const { id } = req.params;
        const { title, description, date, time_range, location, is_published, category } = req.body;

        const event = await Event.findOne({ where: { id, school_id } });
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const updateData = {
            title,
            description,
            date,
            time_range,
            location,
            category
        };

        if (is_published !== undefined) {
            updateData.is_published = (is_published === 'false' || is_published === false) ? false : true;
        }

        if (title && title !== event.title) {
            updateData.slug = generateSlug(title);
        }

        if (req.files) {
            req.files.forEach(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');
                if (file.fieldname === 'image') updateData.image_url = normalizedPath;
            });
        }

        // If no new image but exists in body (as a URL), keep it
        if (!updateData.image_url && req.body.image_url) {
            updateData.image_url = req.body.image_url;
        }

        await event.update(updateData);
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating event' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const event = await Event.findOne({ where: { id, school_id } });
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.destroy();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event' });
    }
};
