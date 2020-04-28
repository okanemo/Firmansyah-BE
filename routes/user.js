const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../helpers/validation');
const verify = require('../helpers/verifyToken');


//REGISTER USER
router.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    //VALIDATE THE DATA
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Give role access
    const roleUser = req.body.email === 'admin@gmail.com' ? 'admin' : 'subs';

    //Create a new user
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        role: roleUser
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

//LOGIN USER
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    //VALIDATE THE DATA
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send('Email not registered');

    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({token: token, name: user.name, role: user.role});
});

//SELECT ALL USER
router.get('/all', verify, async (req, res) => {
    const userRole = req.user.role;

    // Check role
    if (userRole !== 'admin') return res.status(401).send('Unauthorized');

    const users = await User.find({});

    res.send(users);

});

//UPDATE ROLE USER
router.put('/:id', verify, async (req, res) => {
    const userRole = req.user.role;

    // Check role
    if (userRole !== 'admin') return res.status(401).send('Unauthorized');

    const id = req.params.id

    await User.findOneAndUpdate({_id: id}, {$set:{role: req.body.newRole}}, {new: true}, err => {
        if (err) {
            res.send(err);
        }
        res.status(200).send('Update has succesfully');
    })
});

//DELETE USER
router.delete('/:id', verify, async (req, res) => {
    const userRole = req.user.role;

    // Check role
    if (userRole !== 'admin') return res.status(401).send('Unauthorized');

    const id = req.params.id

    await User.findOneAndDelete({_id: id}, err => {
        if (err) {
            res.send(err);
        }
        res.status(200).send('Delete has succesfully');
    })
})

module.exports = router;