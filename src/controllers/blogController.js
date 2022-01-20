const BlogModel = require('../models/blogmodel')
const AuthorModel = require('../models/authorModel')


const createBlog = async function (req, res) {
    try {
        //authorisation
        let id = req.body.authorId;
        let decodeId = req.decodedtoken.userId;

        if (decodeId == id) {

            if (req.body.isPublished == true) {
                req.body.publishedAt = Date.now()
            }

            let authorData = await AuthorModel.findOne({ _id: id })
            if (authorData) {
                let body = req.body;
                let data = await BlogModel.create(body);
                res.status(201).send({ status: true, data: data })
            }
        } else {
            res.status(403).send({ status: false, msg: 'authorisation failed' })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const fetchBlogs = async function (req, res) {
    try {
        let getQuery = {
            isDeleted: false,
            isPublished: true
        }
        if (req.query.author_id) {
            getQuery.author_id = req.query.author_id
        }
        if (req.query.tags) {
            getQuery.tags = req.query.tags
        }
        if (req.query.category) {
            getQuery.category = req.query.category
        }
        if (req.query.subcategory) {
            getQuery.subcategory = req.query.subcategory
        }
        let block = await BlogModel.find(getQuery)
        if (block.length == 0) {
            res.status(400).send({ status: false, data: "Element not found!!" })
        }
        else {
            res.status(200).send({ status: true, msg: block })
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


const updateBlog = async function (req, res) {
    try {
        let decodeId = req.decodedtoken.userId;
        let blogId = req.params.blogId;
        let blogUser = await BlogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blogUser) {
            return res.status(404).send({ status: false, msg: 'invalid blog id/blog is deleted' })
        }
        let authorId = blogUser.authorId;
        if (decodeId == authorId) {
            let body = req.body;
            let id = req.params.blogId;
            if (body.hasOwnProperty("isPublished") == true) {
                let updatedValue = await BlogModel.findOneAndUpdate({ _id: id, isDeleted: false }, {
                    $set: {
                        title: req.body.title,
                        body: req.body.body,
                        category: req.body.category,
                        isPublished: req.body.isPublished,
                        publishedAt: Date.now(),
                        updatedAt: Date.now()
                    },
                    $push: {
                        tags: req.body.tags,
                        subcategory: req.body.subcategory
                    }
                }, { new: true })
                res.status(200).send({ status: true, data: updatedValue });
            } else {
                let updatedValue = await BlogModel.findOneAndUpdate({ _id: id, isDeleted: false }, {
                    $set: {
                        title: req.body.title,
                        body: req.body.body,
                        category: req.body.category,
                        updatedAt: Date.now()
                    },
                    $push: {
                        tags: req.body.tags,
                        subcategory: req.body.subcategory
                    }
                }, { new: true })
                res.status(200).send({ status: true, data: updatedValue });
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const deleteById = async function (req, res) {
    try {
        let decodeId = req.decodedtoken.userId;
        let blogId = req.params.blogId;

        let blogUser = await BlogModel.findOne({ _id: blogId })
        if (!blogUser) {
            return res.status(400).send({ status: false, msg: 'invalid blog id' })
        }
        let authorId = blogUser.authorId;
        if (decodeId == authorId) {
            let id = req.params.blogId;
            let data = await BlogModel.findOne({ _id: id, isDeleted: false })
            if (data) {
                let deleteData = await BlogModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
                res.status(200).send({ status: true, data: deleteData })
            } else {
                res.send({ msg: "invalid input of id or the document is already delete" })
            }
        }
    } catch (err) {
        res.status(400).send({ msg: err.message })
    }
}


const deleteByQuery = async function(req, res) {
    try {
        let getQuery = {
            isDeleted: false
        }
        if (req.query.author_id) {
            getQuery.author_id = req.query.author_id
        }
        if (req.query.tags) {
            getQuery.tags = req.query.tags
        }
        if (req.query.category) {
            getQuery.category = req.query.category
        }
        if (req.query.subcategory) {
            getQuery.subcategory = req.query.subcategory
        }
        if (req.query.isPublished) {
            getQuery.isPublished = req.query.isPublished
        }
        let getAuthorId = await BlogModel.find(getQuery)
        if (!getAuthorId) {
            res.status(400).send({ status: false, message: "invalid BlogId!!!" })
        }
        if (req.query.author_id == req.validToken) {
            let blogsData = []
            for (let i = 0; i < getAuthorId.length; i++) {
                let deleteData = await BlogModel.findOneAndUpdate(getQuery,
                    { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
                blogsData.push(deleteData)
            }
            res.status(200).send({ msg: blogsData })
        } else {
            res.status(403).send({ status: false, message: 'invalid token' })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports.createBlog = createBlog;
module.exports.fetchBlogs = fetchBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteById = deleteById;
module.exports.deleteByQuery = deleteByQuery;