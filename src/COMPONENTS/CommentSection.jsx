import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';

function CommentSection({ recipeId, modal }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [token, setToken] = useState(null);

  // Fetch the authentication token from sessionStorage when the component mounts
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // Fetch comments from the backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/comments/${recipeId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error.response || error.message);
      }
    };
    fetchComments();
  }, [recipeId]);

  // Handle submitting a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
  
    if (!token) {
      console.error("Error: Authentication token is missing.");
      return alert("Please log in to add a comment.");
    }
  
    try {
      const response = await axios.post(
        'http://localhost:4001/api/addComment', // Ensure route matches backend
        { recipeId, text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      );
  
      setComments((prev) => [...prev, response.data]); // Update comments with new one
      setNewComment(''); // Clear input
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
      alert("Failed to add comment. Please try again.");
    }
  };
  
  return (
    <div>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.userId?.username || 'Anonymous'}</strong>: {comment.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddComment} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          required
          style={{
            width: modal ? '100%' : 'calc(100% - 40px)',
            height: '40px',
            resize: 'none',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        ></textarea>
        <button
          type="submit"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#007bff',
            fontSize: '1.5rem',
          }}
          aria-label="Submit comment"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
