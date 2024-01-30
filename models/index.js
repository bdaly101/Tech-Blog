const User = require('./User');
const Blog = require('./Blog');
const Comment = require('./Comment');

User.hasMany(Blog, {
  as: 'blog',
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Blog.belongsTo(User, {
  foreignKey: 'user_id'
});

Blog.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'blog_id',
    onDelete: 'CASCADE'
})

Comment.belongsTo(Blog, {
    foreignKey:'blog_id'
})

// In your association setup file
Comment.belongsTo(User, {
  foreignKey: 'user_id', // assuming 'user_id' is the foreign key in 'Comment' model
  as: 'user' // This alias must match what's used in the route's include
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  as: 'comments' // Only needed if you plan to fetch user's comments
});


module.exports = { User, Blog, Comment };