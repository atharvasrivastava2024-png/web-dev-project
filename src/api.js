const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function createUser(userData) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
}

export async function createWorker(workerData) {
  const res = await fetch(`${API_URL}/workers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workerData)
  });
  return res.json();
}

export async function postJob(jobData) {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });
  return res.json();
}

export async function getJobs(filters = {}) {
  // Simple querying
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams ? `${API_URL}/jobs?${queryParams}` : `${API_URL}/jobs`;
  const res = await fetch(url);
  return res.json();
}

export async function updateJob(jobId, updates) {
  const res = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function getUser(userId) {
  const res = await fetch(`${API_URL}/users/${userId}`);
  return res.json();
}

export async function getWorker(workerId) {
  const res = await fetch(`${API_URL}/workers/${workerId}`);
  return res.json();
}

export async function getUserByEmail(email) {
  const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
  const users = await res.json();
  return users.length > 0 ? users[0] : null;
}

export async function getWorkerByEmail(email) {
  const res = await fetch(`${API_URL}/workers?email=${encodeURIComponent(email)}`);
  const workers = await res.json();
  return workers.length > 0 ? workers[0] : null;
}
