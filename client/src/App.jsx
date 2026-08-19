import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import ComplaintSuccess from './pages/ComplaintSuccess.jsx';
import TrackComplaint from './pages/TrackComplaint.jsx';
import CitizenLogin from './pages/CitizenLogin.jsx';
import MyComplaints from './pages/MyComplaints.jsx';
import AuthorityLogin from './pages/AuthorityLogin.jsx';
import AuthorityDashboard from './pages/AuthorityDashboard.jsx';
import ComplaintReview from './pages/ComplaintReview.jsx';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/complaint-success" element={<ComplaintSuccess />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/login" element={<CitizenLogin />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/authority/login" element={<AuthorityLogin />} />
          <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
          <Route path="/authority/review/:complaintId" element={<ComplaintReview />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
