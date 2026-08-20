import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const api = axios.create({ baseURL: API_BASE_URL });

function authHeader(tokenKey) {
  const token = localStorage.getItem(tokenKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function friendlyError(err, fallback) {
  const message = err?.response?.data?.message || fallback;
  return { success: false, message };
}

// ---- Citizen account (login/signup) ----

export async function citizenSignup(name, email, password, phone) {
  try {
    const { data } = await api.post('/citizens/signup', { name, email, password, phone });
    if (data.success) {
      localStorage.setItem('cc_citizen_token', data.token);
      localStorage.setItem('cc_citizen_name', data.name);
    }
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not create your account. Please try again.');
  }
}

export async function citizenLogin(email, password) {
  try {
    const { data } = await api.post('/citizens/login', { email, password });
    if (data.success) {
      localStorage.setItem('cc_citizen_token', data.token);
      localStorage.setItem('cc_citizen_name', data.name);
    }
    return data;
  } catch (err) {
    return friendlyError(err, 'Login failed. Please check your credentials.');
  }
}

export function citizenLogout() {
  localStorage.removeItem('cc_citizen_token');
  localStorage.removeItem('cc_citizen_name');
}

export function isCitizenLoggedIn() {
  return Boolean(localStorage.getItem('cc_citizen_token'));
}

export function getCitizenName() {
  return localStorage.getItem('cc_citizen_name') || '';
}

export async function getMyComplaints() {
  try {
    const { data } = await api.get('/complaints/mine/list', { headers: authHeader('cc_citizen_token') });
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not load your complaints. Please try again.');
  }
}

// ---- Citizen complaint APIs ----
// Note: createComplaint works whether or not the citizen is logged in.
// If a valid citizen token is present it gets linked to their account
// automatically; otherwise it's submitted anonymously (same as before).

export async function createComplaint(formData) {
  try {
    const { data } = await api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...authHeader('cc_citizen_token') },
    });
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not submit your complaint. Please check your connection and try again.');
  }
}

export async function getComplaint(complaintId) {
  try {
    const { data } = await api.get(`/complaints/${encodeURIComponent(complaintId)}`);
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not find that complaint. Please check the ID and try again.');
  }
}

export async function getPublicStats() {
  try {
    const { data } = await api.get('/complaints/stats/public');
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not load platform stats.');
  }
}

export async function rateComplaint(complaintId, score, feedback) {
  try {
    const { data } = await api.patch(`/complaints/${encodeURIComponent(complaintId)}/rate`, { score, feedback });
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not submit your rating. Please try again.');
  }
}

// ---- Authority APIs ----

export async function authorityLogin(username, password) {
  try {
    const { data } = await api.post('/auth/login', { username, password });
    if (data.success) {
      localStorage.setItem('cc_authority_token', data.token);
      localStorage.setItem('cc_authority_user', data.username);
    }
    return data;
  } catch (err) {
    return friendlyError(err, 'Login failed. Please check your credentials.');
  }
}

export function authorityLogout() {
  localStorage.removeItem('cc_authority_token');
  localStorage.removeItem('cc_authority_user');
}

export function isAuthorityLoggedIn() {
  return Boolean(localStorage.getItem('cc_authority_token'));
}

export async function getAllComplaints(params = {}) {
  try {
    const { data } = await api.get('/complaints', { params, headers: authHeader('cc_authority_token') });
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not load complaints. Please try again.');
  }
}

export async function updateComplaint(complaintId, updates) {
  try {
    const { data } = await api.patch(`/complaints/${encodeURIComponent(complaintId)}`, updates, {
      headers: authHeader('cc_authority_token'),
    });
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not update this complaint. Please try again.');
  }
}

export async function resolveComplaint(complaintId, photoFile) {
  try {
    const formData = new FormData();
    if (photoFile) formData.append('resolutionPhoto', photoFile);
    const { data } = await api.post(
      `/complaints/${encodeURIComponent(complaintId)}/resolve`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data', ...authHeader('cc_authority_token') } }
    );
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not mark this complaint as resolved. Please try again.');
  }
}

export async function mergeComplaints(complaintId, duplicateIds) {
  try {
    const { data } = await api.post(
      `/complaints/${encodeURIComponent(complaintId)}/merge`,
      { duplicateIds },
      { headers: authHeader('cc_authority_token') }
    );
    return data;
  } catch (err) {
    return friendlyError(err, 'Could not merge these complaints right now.');
  }
}

// ---- Free reverse geocoding (OpenStreetMap Nominatim - no API key needed) ----

export async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || '';
    const state = addr.state || '';
    if (city && state) return `${city}, ${state}`;
    return data.display_name || '';
  } catch {
    return '';
  }
}