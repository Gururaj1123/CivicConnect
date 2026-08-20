import { useState, useRef, useEffect } from 'react';
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

  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);

  // Stop the mic if the user navigates away mid-recording
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function handleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice input isn\u2019t supported in this browser. Try Chrome or Edge, or type your description instead.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    setVoiceError('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setVoiceError('Microphone permission was denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please try again.');
      } else {
        setVoiceError('Voice input failed. Please try again or type instead.');
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <label className="field-label" htmlFor="description" style={{ marginBottom: 0 }}>Description</label>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleVoiceInput}
            style={isListening ? { background: '#fee2e2', color: '#dc2626' } : undefined}
          >
            {isListening ? '⏹ Stop Listening' : '🎤 Speak Instead'}
          </button>
        </div>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the issue, or tap the mic to speak it…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginTop: '10px' }}
        />
        {isListening && <p className="demo-note" style={{ color: '#dc2626' }}>🔴 Listening… speak now.</p>}
        {voiceError && <p className="field-error">{voiceError}</p>}
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