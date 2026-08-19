import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker.jsx';
import PhotoUploader from './PhotoUploader.jsx';
import { createComplaint } from '../services/api.js';

const CATEGORIES = [
  'Garbage/Waste',
  'Road Damage',
  'Streetlight',
  'Drainage',
  'Water Supply',
  'Sanitation',
  'Public Infrastructure',
  'Other',
];

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validate() {
    const next = {};
    if (!category) next.category = 'Please select an issue category.';
    if (!description.trim()) next.description = 'Please describe the issue.';
    if (!location) next.location = 'Please capture your location before submitting.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);
    formData.append('address', location.address || '');
    if (photo) formData.append('photo', photo);

    const result = await createComplaint(formData);
    setSubmitting(false);

    if (result.success) {
      navigate('/complaint-success', { state: { complaint: result.complaint } });
    } else {
      setSubmitError(result.message);
    }
  }

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="field-label" htmlFor="category">Issue Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select a category…</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="field-error">{errors.category}</p>}
      </div>

      <div className="form-group">
        <label className="field-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the issue…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <LocationPicker onLocationChange={setLocation} />
        {errors.location && <p className="field-error">{errors.location}</p>}
      </div>

      <div className="form-group">
        <PhotoUploader onPhotoChange={setPhoto} />
      </div>

      {submitError && <p className="field-error form-level-error">{submitError}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Complaint'}
      </button>
    </form>
  );
}
