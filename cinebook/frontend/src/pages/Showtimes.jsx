
import React, {useEffect, useState} from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchJSON } from '../api'

export default function Showtimes(){
  const { id } = useParams();
  const [showtimes, setShowtimes] = useState([]);
  useEffect(()=>{
    fetchJSON(`/movies/${id}/showtimes`).then(setShowtimes).catch(console.error);
  },[id]);
  return (
    <div>
      <h2>Showtimes</h2>
      {showtimes.length === 0 && <p>No showtimes found.</p>}
      <ul>
        {showtimes.map(s=>(
          <li key={s._id || s.time}>
            {s.time} — <Link to={`/booking/${id}/${s._id || encodeURIComponent(s.time)}`}>Book Seats</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
