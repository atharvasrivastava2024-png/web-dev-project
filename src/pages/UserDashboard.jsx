import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Plus, Activity, Star, ShieldCheck, MapPin, Calendar, Clock, X, Check, XCircle } from 'lucide-react';
import { getJobs, postJob, updateJob } from '../api';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // No user logged in, redirect to login
      navigate('/login/user');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const userJobs = await getJobs({ userId: user.id });
      setJobs(userJobs);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await postJob({
        ...data,
        userId: user.id,
        userName: user.name,
        userArea: user.area,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      setIsPosting(false);
      fetchJobs();
    } catch (error) {
      console.error("Failed to post job", error);
      alert('Failed to post request.');
    }
  };

  const handleAcceptQuote = async (job) => {
    try {
      await updateJob(job.id, { status: 'Confirmed' });
      fetchJobs();
    } catch (error) {
      console.error("Error accepting quote", error);
    }
  };

  const handleRejectQuote = async (job) => {
    try {
      await updateJob(job.id, { 
        status: 'Pending', 
        workerId: null, 
        workerName: null, 
        proposedPrice: null 
      });
      fetchJobs();
    } catch (error) {
      console.error("Error rejecting quote", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!user) return <div className="container" style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className="container user-theme" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 0' }}>
      
      {/* Topbar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--user-accent)', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            LS
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0' }}>User Dashboard</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome back, {user.name}!</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-primary-user" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setIsPosting(!isPosting)}>
            {isPosting ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Post Request</>}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px', borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--user-bg-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="var(--user-accent)" />
            </div>
            <button className="btn btn-outline" style={{ padding: '8px', border: 'none' }} title="Logout" onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {isPosting && (
        <div className="glass-panel" style={{ background: 'var(--user-bg-gradient)', border: '2px dashed var(--user-accent)' }}>
          <h3 className="mb-3">Post a New Request</h3>
          <form onSubmit={handlePostJob}>
             <div className="grid-2 mb-3">
               <div className="form-group">
                 <label>Service Needed</label>
                 <select name="service" required>
                    <option value="" disabled selected>Select service</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical Repair</option>
                    <option value="cleaning">Home Cleaning</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="appliance">Appliance Repair</option>
                 </select>
               </div>
               <div className="form-group">
                 <label>Urgency / When</label>
                 <select name="urgency" required>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="flexible">Flexible</option>
                 </select>
               </div>
               <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                 <label>Description</label>
                 <textarea name="description" rows="3" placeholder="Describe what exactly needs to be done..." required></textarea>
               </div>
             </div>
             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <button type="submit" className="btn btn-primary-user">Publish Job Request</button>
             </div>
          </form>
        </div>
      )}

      {/* Main Grid: 3 Stats Cards */}
      <div className="grid-3">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between mb-3">
            <h3 style={{ fontSize: '1.1rem' }}>Active Requests</h3>
            <Activity color="var(--user-accent)" />
          </div>
          <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', lineHeight: '1' }}>{jobs.filter(j => ['Pending','Proposed'].includes(j.status)).length}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Pending or quoted</p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between mb-3">
            <h3 style={{ fontSize: '1.1rem' }}>Total Requests</h3>
            <Star color="#f59e0b" />
          </div>
          <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', lineHeight: '1' }}>{jobs.length}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>History overview</p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between mb-3">
            <h3 style={{ fontSize: '1.1rem' }}>Profile</h3>
            <ShieldCheck color="#10b981" />
          </div>
          <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', lineHeight: '1' }}>Active</p>
          <Link to="/signup/user" style={{ fontSize: '0.85rem', color: 'var(--user-accent)', marginTop: '8px', display: 'inline-block', fontWeight: '500' }}>Edit Profile →</Link>
        </div>
      </div>

      {/* Upcoming Bookings / Jobs List */}
      <div className="glass-panel">
        <h3 className="mb-4">My Requests History</h3>
        
        {jobs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>You haven't posted any jobs yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.slice().reverse().map(job => (
              <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: job.status === 'Proposed' ? '2px solid var(--user-accent)' : '1px solid rgba(45, 42, 38, 0.1)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.5)' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--user-bg-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={24} color="var(--user-accent)" />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                      {job.service} Service
                    </h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{job.description}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {job.urgency}
                      </span>
                      {job.workerName && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--user-accent)' }}>
                          <User size={14} /> Worker: {job.workerName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {job.status === 'Proposed' ? (
                    <>
                      <div style={{ background: 'var(--user-bg-gradient)', padding: '8px 16px', borderRadius: '12px', marginBottom: '4px' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Proposed Price</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'var(--user-accent)' }}>₹{job.proposedPrice}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 12px', color: '#dc2626', borderColor: '#dc2626' }} onClick={() => handleRejectQuote(job)}>
                          Reject
                        </button>
                        <button className="btn btn-primary-user" style={{ padding: '6px 16px' }} onClick={() => handleAcceptQuote(job)}>
                          Accept Quote
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold', 
                        background: job.status === 'Completed' ? '#d1fae5' : job.status === 'Confirmed' ? '#cffafe' : '#fef3c7', 
                        color: job.status === 'Completed' ? '#065f46' : job.status === 'Confirmed' ? '#164e63' : '#92400e' }}>
                        {job.status}
                      </span>
                      {(job.status === 'Confirmed' || job.status === 'Completed') && job.proposedPrice && (
                         <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#065f46', margin: '4px 0 0 0' }}>Agreed: ₹{job.proposedPrice}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
