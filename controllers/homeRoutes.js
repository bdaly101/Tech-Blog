const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'user',
        },
      ],
    });
    

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    if (req.session.logged_in) {
      console.log("LoggedIn")
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] }
      });
  
      if(!userData) {
        res.status(402).send('User not found');
        return;
      }   
  
      const user = userData.get({ plain: true });
  
      // Pass serialized data and session flag into template
      res.render('homepage', { 
        blogs, 
        user,
        logged_in: req.session.logged_in 
      });
    }
    else {
      console.log("Not logged in")
      res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.render('login');
    }
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'user' // Ensure the alias 'user' matches the model association
        },
        {
          model: Comment,
          attributes: ['comment_body', 'date_created'],
          as: 'comments',
          include: [{
            model: User,
            attributes: ['username'],
            as: 'user' // Also ensure this alias matches the association within Comment
          }]
        },
      ],
    });

    if (!blogData) {
      res.status(404).send('Post not found');
      return;
    }

    const blog = blogData.get({ plain: true });
    //console.log(blog)
    const currUser = req.session.user_id;
    //console.log(currUserId);
    res.render('post', {
      currUser,
      blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});


// Use withAuth middleware to prevent access to route
router.get('/user', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog, as: 'blog' }],
    });

    const user = userData.get({ plain: true });

    res.render('homepage', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/dashboard', async (req, res) => {
  try {
    if (!req.session.logged_in) {
    // Redirect to the login page
    res.render('login');
    return;
  };
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog, as: 'blog' }],
    });

    const user = userData.get({ plain: true });
    const blogData = await Blog.findAll({
      where: { user_id: req.session.user_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'],
        },
      ],
    });
    
    

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));
    console.log(blogs)
    res.render('dashboard', {
      user,
      blogs,
      logged_in: true
    });
  
}
catch (err) {
  console.log(err)
  res.status(500).json(err);
}
});

router.get('/newPost', (req, res) => {
  if (!req.session.logged_in) {
    res.redirect('/');
    return;
  } 
  res.render('newPost')
})

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
