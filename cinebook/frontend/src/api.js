
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function fetchJSON(path){
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error('Fetch error '+res.status);
  return res.json();
}

export async function postJSON(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Post error '+res.status);
  return res.json();
}
