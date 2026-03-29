import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Clock } from 'lucide-react';
import { createUser } from '../api';

export default function UserForm() {
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
    const { confirmPassword, ...userData } = data;
    
    try {
      const newUser = await createUser({
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      navigate('/dashboard/user');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to save profile. Is json-server running?');
    }
  };

  return (
    <div className="container user-theme" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      <Link to="/login/user" className="btn btn-outline mb-3" style={{ border: 'none', padding: '0', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={16} /> Back to Login
      </Link>

      <div className="glass-panel">
        <h1 className="mb-2">Create User Profile</h1>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Welcome to Local Skills! Let's get your basic information set up.</p>

        <form onSubmit={handleSave}>
          <h3 className="mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Contact Information</h3>
          <div className="grid-2 mb-4">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="+91 98765 43210" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" placeholder="Mumbai" required />
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

          <h3 className="mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Location & Preferences</h3>
          <div className="grid-2 mb-4">
            <div className="form-group">
              <label>Neighborhood / Area</label>
              <input type="text" name="area" placeholder="Andheri West" required />
            </div>
            <div className="form-group">
              <label>Preferred Contact Method</label>
              <select name="contactMethod" required>
                <option value="phone">Phone Call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Service Preferences / Accessibility Notes</label>
              <textarea name="notes" rows="4" placeholder="Any specific requirements or notes for workers coming to your place..."></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="button" className="btn btn-outline btn-outline-user" onClick={() => navigate('/')}>
              <Clock size={16} /> Complete Later
            </button>
            <button type="submit" className="btn btn-primary-user">
              <Save size={16} /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
