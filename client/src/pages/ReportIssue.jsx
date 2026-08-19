import { Navigate } from 'react-router-dom';
import ComplaintForm from '../components/ComplaintForm.jsx';
import { isCitizenLoggedIn } from '../services/api.js';

export default function ReportIssue() {
  if (!isCitizenLoggedIn()) {
    return <Navigate to="/login" state={{ from: '/report' }} replace />;
  }

  return (
    <div className="page-container narrow">
      <h1>Report an Issue</h1>
      <p className="page-subtitle">Fill in the details below. Location and description are required; a photo is optional.</p>
      <ComplaintForm />
    </div>
  );
}
