const user = require("./user.js");
const homework = require("./homework.js")
const classes = require("./class.js")

exports.user = {
    get: {
        tokenRequired: true,
        bind: user.get
    }
};

exports.homework = {
    create: {
        method: "post",
        level: 1,
        bind: homework.create
    },
    get: {
        method: "get",
        level: 1,
        bind: homework.get
    },
    getAll: {
        method: "get",
        level: 0,
        bind: homework.getAll
    }
}

exports.class = {
    create: {
        method: "post",
        level: 1,
        bind: classes.create
    },
    get: {
        method: "get",
        level: 0,
        bind: classes.get
    },
    getAll: {
        method: "get",
        level: 0,
        bind: classes.getAll
    },
    join: {
        method: "post",
        level: 0,
        bind: classes.join
    },
    getAllUser: {
        method: "get",
        level: 0,
        bind: classes.getAllUser
    },
    getAllCreator: {
        method: "get",
        level: 1,
        bind: classes.getAllCreator
    }
}