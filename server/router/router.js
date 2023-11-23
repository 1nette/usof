const express = require("express");
const router = express.Router();
const { uploadAvatar, uploadPost } = require("../additional/filesUpload.js");
const userController = require("../controllers/userController.js");
const postController = require("../controllers/postController.js");
const categoriesController = require("../controllers/categoriesController.js");
const commentsController = require("../controllers/commentsController.js");

router.get('/test', userController.test);

//auth
router.post('/auth/register', userController.userRegistration);
router.get('/auth/confirmation/:token', userController.confirmEmail);
router.post('/auth/password-reset/', userController.resetPass);
router.post('/auth/password-reset/:token', userController.resetPassConfirm);
router.post('/auth/login', userController.login);
router.post('/auth/logout/:token', userController.logout);

//user module
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getSpecifiedUser);
router.get('/users/get/current/:token', userController.getCurrentUser);
router.get('/users/get/is/admin/:token', userController.getIsAdmin);
router.get('/users/get/rating/:id', userController.getUserRating);
router.post('/users/:token', userController.createUser); // admin's feature
router.patch('/users/avatar/:token', uploadAvatar.single('image'), userController.uploadAvatar); // author's feature
router.get('/users/update/:token', userController.getUserForUpdate); // author's feature
router.patch('/users/update/:token', userController.updateUser); // author's feature
router.get('/users/confirmation/:token', userController.confirmNewEmail);
router.delete('/users/delete/:id/:token', userController.deleteUser); // admin's feature

//posts module
router.get('/posts/:token', postController.getPosts); // public (see unactive is admin's feature)
router.get('/posts/:id/:token', postController.getSpecifiedPost); // public (see unactive is admin's feature)
router.get('/posts/by/author/:id/:token', postController.getPostsByAuthor); // public (see unactive is admin's feature)
router.get('/posts/get/comments/:id', postController.getAllComments); // public
router.post('/posts/:id/comments/:token', postController.createComment);
router.get('/posts/get/categories/:id', postController.getPostCategories);
router.get('/posts/get/user/info/:token/:id', postController.getUserInfo);
router.get('/posts/:id/likes/:token', postController.getPostLikes);
router.post('/posts/:token', postController.createPost);
router.post('/posts/:id/like/:token', postController.newPostLike);
router.patch('/posts/:id/:token', postController.updatePost); // author's feature
router.patch('/posts/:id/ban/:token', postController.banPost); // admin's feature
router.delete('/posts/:id/:token', postController.deletePost); // author's and admin's feature

//categories module
router.get('/all/categories', categoriesController.getAllCategories);
router.get('/categories/:id', categoriesController.getSpecifiedCategory);
router.get('/categories/:id/posts', categoriesController.getPostsByCategory);
router.post('/categories/:token', categoriesController.newCategory); // admin's feature
router.patch('/categories/:id/:token', categoriesController.updateCategory); // admin's feature
router.delete('/categories/:id/:token', categoriesController.deleteCategory); // admin's feature

//comments module
router.get('/comments/:id', commentsController.getSpecifiedComment);
router.get('/comments/:id/like/:token', commentsController.getCommentLikes);
router.get('/comments/get/user/info/:token/:id', commentsController.getUserInfo);
router.post('/comments/:id/like/:token', commentsController.newCommentLike);
router.patch('/comments/:id/:token', commentsController.updateComment);
router.delete('/comments/:id/:token', commentsController.deleteComment); // author's and admin's feature

module.exports = router;