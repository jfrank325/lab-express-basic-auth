const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(plainText, salt);
