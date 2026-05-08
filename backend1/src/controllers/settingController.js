const GlobalSetting = require('../models/GlobalSetting');

exports.getSettings = async (req, res) => {
    try {
        const settings = await GlobalSetting.findOne();
        res.json(settings || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        let settings = await GlobalSetting.findOne();
        if (settings) {
            await settings.update(req.body);
            res.json(settings);
        } else {
            settings = await GlobalSetting.create(req.body);
            res.status(201).json(settings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
