
const editButton = document.getElementById('edit-post-btn');
const viewModeDiv = document.getElementById('view-mode');
const editModeDiv = document.getElementById('edit-mode');
const editForm = document.getElementById('edit-post-form');

const commentForm = document.getElementById('new-comment-form');

commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const blog_id = document.getElementById('blog-id').value;
  
  const comment_body = document.getElementById('comment').value;
  
  const body = JSON.stringify({ comment_body, blog_id,})
  console.log(body)
  const response = await fetch(`/api/comments/`, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // Handle the response from the server
  if (response.ok) {
    console.log(response)
    document.location.reload(); // Reload the page to display the new comment
  } else {

    alert('Failed in editPost.js ' + response.statusText);
  } 
});


const editPostHandler = async (event) => {
  event.preventDefault();
  viewModeDiv.style.display = 'none';
  editModeDiv.style.display = 'block';
}

editButton.addEventListener('click', editPostHandler);

editForm.onsubmit = async (event) => {
  event.preventDefault();

  const blogId = editForm.action.split('/').pop();
  const blogHeader = document.getElementById('blog_header').value;
  const blogBody = document.getElementById('blog_body').value;

  const response = await fetch(`/api/blogs/${blogId}`, {
    method: 'PUT', // Use PUT method for update
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      blog_header: blogHeader,
      blog_body: blogBody,
    }),
  });

  if (response.ok) {
    document.location.reload(); // Reload the page to see the updated post
  } else {
    alert('Failed to update post.');
  }
};