import { useState } from 'react';

// Shown to citizens on the Track Complaint page once a complaint is
// RESOLVED and hasn't been rated yet. Purely a citizen-facing widget -
// authorities never see or trigger this.
export default function StarRating({ onSubmit, submitting }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="star-rating">
      <p className="field-label">How satisfied are you with the resolution?</p>
      <div className="stars" role="radiogroup" aria-label="Satisfaction rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            className={n <= (hover || score) ? 'star filled' : 'star'}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setScore(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        placeholder="Optional feedback…"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={!score || submitting}
        onClick={() => onSubmit(score, feedback)}
      >
        {submitting ? 'Submitting…' : 'Submit Rating'}
      </button>
    </div>
  );
}
