
import React, {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postJSON } from '../api'

export default function Seats(){
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  const rows = 5, cols = 8;
  const [selected, setSelected] = useState([]);
  const toggle = (r,c)=>{
    const seat = String.fromCharCode(65+r) + (c+1);
    setSelected(s => s.includes(seat) ? s.filter(x=>x!==seat) : [...s,seat]);
  };
  const handleBook = async ()=>{
    if (selected.length===0) return alert('select seats');
    try{
      const res = await postJSON('/book', { movieId, showtimeId, seats: selected, customer: { name: 'Guest', email: 'guest@example.com' } });
      navigate('/thankyou', { state: { bookingId: res.bookingId } });
    }catch(e){
      alert('Booking failed: '+e.message);
    }
  };
  return (
    <div>
      <h2>Select Seats</h2>
      <div className="seatmap">
        {Array.from({length: rows}).map((_,r)=>(
          <div key={r} className="row">
            {Array.from({length: cols}).map((_,c)=>{
              const seat = String.fromCharCode(65+r) + (c+1);
              const sel = selected.includes(seat);
              return <button key={c} className={'seat'+(sel?' selected':'')} onClick={()=>toggle(r,c)}>{seat}</button>
            })}
          </div>
        ))}
      </div>
      <p>Selected: {selected.join(', ') || '—'}</p>
      <button onClick={handleBook} className="primary">Book</button>
    </div>
  )
}
