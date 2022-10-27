const router = require('express').Router();
const { User } = require("../models")
const withAuth = require('../utils/auth');

router.get("/", withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.userId);
        res.status(200).json(userData)
        // res.render('menu', {userData})

    } catch(err) {
        res.status(500).json(err)
    }
});

module.exports = router;
