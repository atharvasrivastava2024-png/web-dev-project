import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Clock } from 'lucide-react';
import { createWorker } from '../api';

export default function WorkerForm() {
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Remove confirmPassword before saving
    const { confirmPassword, ...workerData } = data;
    
    try {
      const newWorker = await createWorker({
        ...workerData,
        role: 'worker',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('currentWorker', JSON.stringify(newWorker));
      navigate('/dashboard/worker');
    } catch (error) {
      console.error('Failed to create worker:', error);
      alert('Failed to save profile. Is json-server running?');
    }
  };

  return (
    <div className="container worker-theme" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      <Link to="/login/worker" className="btn btn-outline mb-3" style={{ border: 'none', padding: '0', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={16} /> Back to Login
      </Link>

      <div className="glass-panel">
        <h1 className="mb-2">Create Worker Profile</h1>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Showcase your skills to get hired by locals around you.</p>

        <form onSubmit={handleSave}>
          <h3 className="mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Basic Details</h3>
          <div className="grid-2 mb-4">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Jane Smith" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="+91 98765 43210" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="jane@example.com" required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" placeholder="Mumbai" required />
            </div>
            <div className="form-group">
              <label>Service Radius (km)</label>
              <select name="radius" required>
                <option value="2">2 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Min 6 characters" minLength="6" required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Re-enter password" minLength="6" required />
            </div>
          </div>

          <h3 className="mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Skills & Experience</h3>
          <div className="grid-2 mb-4">
            <div className="form-group">
              <label>Primary Skill</label>
              <select name="primarySkill" required defaultValue="">
                <option value="" disabled>Select a skill</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical Repair</option>
                <option value="cleaning">Home Cleaning</option>
                <option value="carpentry">Carpentry/Assembly</option>
                <option value="appliance">Appliance Repair</option>
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" name="experience" min="0" placeholder="e.g. 5" required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Other Skills (Comma separated)</label>
              <input type="text" name="otherSkills" placeholder="Painting, Gardening..." />
            </div>
          </div>

          <h3 className="mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Schedule & Bio</h3>
          <div className="grid-2 mb-4">
            <div className="form-group">
              <label>Availability</label>
              <select name="availability" required>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekends">Weekends Only</option>
                <option value="flexible">Flexible / Any</option>
              </select>
            </div>
            <div className="form-group">
              <label>Base Hourly Rate (₹)</label>
              <input type="number" name="rate" min="0" placeholder="e.g. 300" required />
            </div>
            <div className="form-group">
              <label>ID Verification Status</label>
              <select name="idVerification" required>
                <option value="aadhaar">Aadhaar (Pending verification)</option>
                <option value="pan">PAN Card (Pending verification)</option>
                <option value="driving">Driving License (Pending verification)</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Short Bio</label>
              <textarea name="bio" rows="4" placeholder="Tell locals about yourself, the quality of your work, and why they should hire you..."></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="button" className="btn btn-outline btn-outline-worker" onClick={() => navigate('/')}>
              <Clock size={16} /> Complete Later
            </button>
            <button type="submit" className="btn btn-primary-worker">
              <Save size={16} /> Submit Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
