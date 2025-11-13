
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { fetchJSON } from '../api'

export default function Movies(){
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    fetchJSON('/movies').then(data=>setMovies(data)).catch(console.error).finally(()=>setLoading(false));
  },[]);
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Movies</h2>
      <div className="grid">
        {movies.map(m=>(
          <div key={m._id} className="card">
            <img src={m.poster || '/assets/posters/placeholder.png'} alt={m.title} className="poster"/>
            <h3>{m.title}</h3>
            <p>{m.genre} • {m.duration} min</p>
            <p>{m.synopsis}</p>
            <p><Link to={`/movies/${m._id}/showtimes`}>Showtimes</Link></p>
          </div>
        ))}
      </div>
    </div>
  )
}
