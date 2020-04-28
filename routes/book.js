const router = require('express').Router();
const Book = require('../model/Book');
const verify = require('../helpers/verifyToken');
const { addBookValidation } = require('../helpers/validation');

//ADDING NEW BOOK
router.post('/add', verify, async (req, res) => {

    const userRole = req.user.role;

    // Check role
    if (userRole !== 'admin') return res.status(401).send('Unauthorized');

    const { judul, pengarang, tahun, penerbit, sinopsis } = req.body;

    //VALIDATE THE DATA
    const { error } = addBookValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if the book is already in the database
    const bookTitle = await Book.findOne({ judul: judul });
    if (bookTitle) return res.status(400).send('Book already exists');

    //Create new book
    const book = new Book({
        judul: judul,
        pengarang: pengarang,
        tahun: tahun,
        penerbit: penerbit,
        sinopsis: sinopsis
    });
    try {
        const savedBook = await book.save();
        res.send(savedBook);
    } catch (err) {
        res.status(400).send(err);
    }
});

//SELECT ALL BOOK
router.get('/all', verify, async (req, res) => {

    const books = await Book.find({});

    res.send(books);
});

//SELECT DETAIL BOOK
router.get('/:id', verify, async (req, res) => {

    const id = req.params.id

    try {
        const book = await Book.findOne({ _id: id });
        res.send(book);
    } catch {
        res.send('Book id not found');
    }
});

//EDIT BOOK
router.put('/:id', verify, async (req, res) => {

    const userRole = req.user.role;

    // Check role
    if (userRole !== 'admin') return res.status(401).send('Unauthorized');

    const { judul, pengarang, tahun, penerbit, sinopsis } = req.body

    const data = {
        judul: judul,
        pengarang: pengarang,
        tahun: tahun,
        penerbit: penerbit,
        sinopsis: sinopsis
    }

    const id = req.params.id

    await Book.findOneAndUpdate({_id: id}, {$set: data}, {new: true}, err => {
        if (err) {
            res.send(err);
        }
        res.status(200).send('Update has succesfully');
    })
});

//DELETE BOOK
router.delete('/:id', verify, async (req, res) => {

    const userRole = req.user.role;

    // Check role
    if (userRole !== 'admin') return res.status(401).send('Unauthorized');

    const id = req.params.id

    await Book.findOneAndDelete({_id: id}, err => {
        if (err) {
            res.send(err);
        }
        res.status(200).send('Delete has succesfully');
    })
});

module.exports = router;