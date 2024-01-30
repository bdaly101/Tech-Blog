const newPostFormHandler = async (event) => {
    event.preventDefault();
    const blog_header = document.querySelector('#title').value.trim();
    const blog_body = document.querySelector('#content').value.trim();
    if (title && content) {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: JSON.stringify({ blog_header, blog_body }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
    else {
        console.error("Enter a title and message")
    }
  };

document
  .querySelector('.new-post-form')
  .addEventListener('submit', newPostFormHandler);