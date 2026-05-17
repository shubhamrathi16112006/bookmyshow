import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const getMovies = (params) => API.get('/movies', { params });
export const getMovie = (id) => API.get(`/movies/${id}`);
export const createMovie = (formData) =>
  API.post('/movies', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMovie = (id) => API.delete(`/movies/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = () => API.get('/bookings');

export default API;
