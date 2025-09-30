const API_URL = process.env.REACT_APP_API_URL || '';

export async function apiFetch(path, options = {}) {
  const url = API_URL + path;
  const res = await fetch(url, options);
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) throw new Error((data && data.error) || 'API error');
  return data;
}
