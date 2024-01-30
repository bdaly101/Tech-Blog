const router = require('express').Router();
const { Comment, User, Blog } = require('../../models');
const withAuth = require('../../utils/auth');
// Get all comments for a blog, id = blog id
router.get('/:id', withAuth, async (req, res) => {
    try {

        const blogId = req.params.id;

        const blogData = await Blog.findByPk(blogId);

        if (!blogData) {
            res.status(404).send('Blog not found!');
            return;
        }

        const commentsData = await Comment.findAll({
            where: { blog_id: blogId }
        });

        const comments = commentsData.map(comment => comment.get({ plain: true }));

        res.status(200).json(comments);

    } catch (err) {
        res.status(500).json(err);
    }
});

// Make new comment id = blog id
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            comment_body: req.body.comment_body,
            blog_id: req.body.blog_id,
            user_id:req.session.user_id,

        });
        console.log(newComment);

        res.status(200).json(newComment);


    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
});


// Edit comment id = comment id
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        const blog = await Blog.findByPk(comment.blog_id);

        if (!blog || blog.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'No blog found for this comment or access denied' });
            return;
        }

        const updatedComment = await Comment.update(req.body, {
            where: {
                id: commentId,
            },
        });

        if (!updatedComment[0]) {
            res.status(404).json({ message: 'Unable to update the comment' });
            return;
        }

        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});


// Delete comment id = comment id
router.delete('/:id', withAuth, async (req, res) => {
    try {

        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        const blog = await Blog.findByPk(comment.blog_id);

        if (!blog || blog.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'No blog found for this comment or access denied' });
            return;
        }

        const deletedComment = await Comment.destroy({
            where: {
                id: commentId,
            },
        });

        if (!deletedComment) {
            res.status(404).json({ message: 'Unable to delete the comment' });
            return;
        }

        else {
            res.status(200).json({ message: "Comment Deleted!" })
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
