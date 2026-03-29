import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle2 } from 'lucide-react';
import { getUserByEmail } from '../api';

export default function UserLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        setError('No account found with this email. Please sign up first.');
      } else if (user.password !== password) {
        setError('Incorrect password. Please try again.');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/dashboard/user');
      }
    } catch (err) {
      setError('Failed to connect. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container user-theme">
      <Link to="/" className="btn btn-outline mb-3" style={{ border: 'none', padding: '0', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={16} /> Back to roles
      </Link>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '600px' }}>
          
          {/* Left Side: Marketing */}
          <div style={{ background: 'var(--user-bg-gradient)', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="mb-4">
              <User size={48} color="var(--user-accent)" />
            </div>
            <h1 className="mb-3">Welcome Back</h1>
            <p className="mb-4" style={{ fontSize: '1.1rem' }}>Log in to your account and manage your local service requests.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 color="var(--user-accent)" /> 
                <span>Fast and easy service requests</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 color="var(--user-accent)" /> 
                <span>Compare trusted local helpers</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 color="var(--user-accent)" /> 
                <span>Secure messaging and booking</span>
              </li>
            </ul>
          </div>

          {/* Right Side: Form */}
          <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="mb-4">Sign In</h2>
            
            <form onSubmit={handleLogin}>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="you@example.com" required />
              </div>
              
              <div className="form-group mb-4">
                <label className="flex-between">
                  Password
                  <a href="#" style={{ fontSize: '0.85rem', color: 'var(--user-accent)' }}>Forgot password?</a>
                </label>
                <input type="password" name="password" placeholder="••••••••" required />
              </div>

              <div className="form-group mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="remember" style={{ width: 'auto' }} />
                <label htmlFor="remember" style={{ marginBottom: 0, fontWeight: 'normal' }}>Remember me</label>
              </div>

              <button type="submit" className="btn btn-primary-user" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Continue to Dashboard'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p>Don't have an account? <Link to="/signup/user" style={{ color: 'var(--user-accent)', fontWeight: 500 }}>Create one</Link></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
