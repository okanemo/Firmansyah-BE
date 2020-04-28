const router = require('express').Router();
const verify = require('../helpers/verifyToken');

router.get('/', verify, (req, res) => {
    const { _id, role } = req.user;

    // Check role
    if (role !== 'admin') return res.status(401).send('Unauthorized');

    res.send(req.user);
});

module.exports = router;