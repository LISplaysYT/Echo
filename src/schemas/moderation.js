const { model, Schema } = require('mongoose');

const schema = new Schema({
    guild: String,
    user: String,
    warnings: String
    },
)
