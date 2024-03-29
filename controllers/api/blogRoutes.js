const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const getSingleBlog = await Blog.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!getSingleBlog) {
            res.status(404).json({ message: 'No blog found with this id!' });
            return;
        }

        res.render('post', {
            ...getSingleBlog,
            logged_in: req.session.logged_in
        });
        
    } catch (err) {
        res.status(500).json(err.message);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!blog) {
            res.status(404).json({ message: 'No blog found with this id!' });
            return;
        }

        if (blog.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'Access denied for this blog' });
            return;
        }

        const updatedBlog = await Blog.update(req.body, {
            where: {
                id: req.params.id,
            },
        });

        if (!updatedBlog[0]) {
            res.status(404).json({ message: 'Unable to update the blog' });
            return;
        }

        res.status(200).json({ message: 'Blog updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;