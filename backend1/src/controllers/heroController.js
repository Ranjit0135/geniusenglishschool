const Hero = require('../models/Hero');

exports.getHero = async (req, res) => {
    try {
        const hero = await Hero.findOne();
        res.json(hero || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const fs = require('fs');
const path = require('path');

exports.updateHero = async (req, res) => {
    try {
        const logFile = path.join(__dirname, '../../debug_hero.log');

        // Ensure column exists (self-recovery)
        try {
            await sequelize.query("ALTER TABLE heros ADD COLUMN IF NOT EXISTS isMuted BOOLEAN DEFAULT TRUE");
        } catch (alterErr) {
            // IF NOT EXISTS might not be supported in some MySQL versions, ignore if already exists
        }

        const debugInfo = {
            timestamp: new Date().toISOString(),
            contentType: req.get('content-type'),
            body: req.body,
            files: req.files ? Object.keys(req.files).map(k => ({
                field: k,
                originalname: req.files[k][0].originalname,
                path: req.files[k][0].path
            })) : 'NO FILES'
        };
        fs.appendFileSync(logFile, JSON.stringify(debugInfo, null, 2) + '\n');

        let heroData = { ...req.body };

        // Convert isMuted string back to Boolean (FormData sends strings)
        if (heroData.isMuted !== undefined) {
            heroData.isMuted = heroData.isMuted === 'true' || heroData.isMuted === true;
        }

        // Handle File Uploads
        if (req.files) {
            if (req.files.video && req.files.video[0]) {
                heroData.videoUrl = req.files.video[0].path;
            }
            if (req.files.image && req.files.image[0]) {
                heroData.imageUrl = req.files.image[0].path;
            }
        }

        // Remove any null/undefined keys to avoid overwriting with NULL if body was empty
        Object.keys(heroData).forEach(key => {
            if (heroData[key] === undefined || heroData[key] === 'undefined' || heroData[key] === 'null' || (key !== 'isMuted' && heroData[key] === '')) {
                delete heroData[key];
            }
        });

        if (Object.keys(heroData).length === 0 && (!req.files || Object.keys(req.files).length === 0)) {
            return res.status(400).json({ message: "No data provided to update" });
        }

        let hero = await Hero.findOne();
        if (hero) {
            await hero.update(heroData);
            res.json(hero);
        } else {
            hero = await Hero.create(heroData);
            res.status(201).json(hero);
        }
    } catch (error) {
        console.error('HERO UPDATE ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};
