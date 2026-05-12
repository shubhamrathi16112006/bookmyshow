import React, { useState } from 'react';
import axios from 'axios';

function MovieForm({ onMovieAdded }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [poster, setPoster] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/movies', { title, genre, poster });
      setTitle('');
      setGenre('');
      setPoster('');
      onMovieAdded(); 
    } catch (error) {
      console.error("Error adding movie", error);
    }
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Movie Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Genre" 
        value={genre} 
        onChange={(e) => setGenre(e.target.value)} 
        required 
      />
      <input 
        type="url" 
        placeholder="Poster Image URL" 
        value={poster} 
        onChange={(e) => setPoster(e.target.value)} 
        required 
      />
      <button type="submit" className="btn btn-submit">Publish Movie</button>
    </form>
  );
}

export default MovieForm;