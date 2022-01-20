const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: 'title is required'
    },

    body: {
        type: String,
        required: 'body is required'
    },

    authorId: {
        type: ObjectId,
        required: 'author id is required',
        ref: 'myAuthor'
    },

    tags: [String],

    category: {
        type: String,
        required: true
    },

    subcategory: [String],

    deletedAt: {

        type: Date

    },

    isDeleted: {

        type: Boolean,

        default: false

    },

    isPublished: {

        type: Boolean,

        default: false

    },
    publishedAt: {
        type: Date

    }

},  { timestamps: true})



module.exports = mongoose.model('myblog', blogSchema)