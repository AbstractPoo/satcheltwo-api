const user = require("./user.js");

exports.user = {
    get: {
        tokenRequired: true,
        bind: user.get
    }
};
