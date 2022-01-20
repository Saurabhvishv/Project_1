const express = require('express');
const router = express.Router();


const AuthorController = require('../controllers/authorController')
const BlogController = require('../controllers/blogController')
const Midd = require('../middleware/authMiddleware')


router.post("/authors", AuthorController.createAuthor)
router.post("/createBlogs", Midd.middleWare, BlogController.createBlog)
router.get("/fetchblogs", Midd.middleWare, BlogController.fetchBlogs)
router.put("/updateblogs/:blogId", Midd.middleWare, BlogController.updateBlog)
router.delete("/deleteblogs/:blogId", Midd.middleWare, BlogController.deleteById)
router.delete("/queryblogs", Midd.middleWare, BlogController.deleteByQuery)
router.post("/login", AuthorController.login)

module.exports = router;