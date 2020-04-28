//VALIDATION
const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data);
};

const addBookValidation = data => {
    const schema = Joi.object({
        judul: Joi.string().required(),
        pengarang: Joi.string().required(),
        tahun: Joi.string().required(),
        penerbit: Joi.string().required(),
        sinopsis: Joi.string().required()
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

module.exports.addBookValidation = addBookValidation;