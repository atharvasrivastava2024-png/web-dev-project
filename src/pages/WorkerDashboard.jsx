import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, LogOut, CheckCircle2, DollarSign, Zap, Star, History, Calendar, MapPin, Clock, IndianRupee } from 'lucide-react';
import { getJobs, updateJob } from '../api';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [quotingJobId, setQuotingJobId] = useState(null);

  useEffect(() => {
    const savedWorker = localStorage.getItem('currentWorker');
    if (savedWorker) {
      setWorker(JSON.parse(savedWorker));
    } else {
      // No worker logged in, redirect to login
      navigate('/login/worker');
    }
  }, [navigate]);

  useEffect(() => {
    if (worker) {
      fetchJobs();
    }
  }, [worker]);

  const fetchJobs = async () => {
    try {
      const allJobs = await getJobs();
      setAvailableJobs(allJobs.filter(j => j.status === 'Pending'));
      // Show proposed, confirmed, or completed jobs for this worker
      setMyJobs(allJobs.filter(j => j.workerId === worker.id));
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  const handleProposePrice = async (e, job) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const price = formData.get('price');
    
    try {
      await updateJob(job.id, {
        status: 'Proposed',
        workerId: worker.id,
        workerName: worker.name,
        proposedPrice: Number(price)
      });
      setQuotingJobId(null);
      fetchJobs();
    } catch (error) {
      console.error("Failed to propose price", error);
      alert('Failed to send quote.');
    }
  };

  const handleMarkCompleted = async (jobId) => {
    try {
      await updateJob(jobId, { status: 'Completed' });
      fetchJobs();
    } catch (error) {
      console.error("Failed to complete job", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentWorker');
    navigate('/');
  };

  if (!worker) return <div className="container" style={{ padding: '40px' }}>Loading...</div>;

  const earnings = myJobs
    .filter(j => j.status === 'Completed' && j.proposedPrice)
    .reduce((sum, j) => sum + j.proposedPrice, 0);
  const completedCount = myJobs.filter(j => j.status === 'Completed').length;

  return (
    <div className="container worker-theme" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 0' }}>
      
      {/* Topbar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--worker-accent)', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            LS
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0' }}>Worker Dashboard</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ready for work, {worker.name}!</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px', borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--worker-bg-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={20} color="var(--worker-accent)" />
            </div>
            <button className="btn btn-outline" style={{ padding: '8px', border: 'none' }} title="Logout" onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3 Stats Cards */}
      <div className="grid-3">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between mb-3">
            <h3 style={{ fontSize: '1.1rem' }}>New Requests</h3>
            <Zap color="var(--worker-accent)" />
          </div>
          <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', lineHeight: '1' }}>{availableJobs.length}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Available right now</p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: 'var(--worker-bg-gradient)', border: '2px solid var(--worker-accent)' }}>
          <div className="flex-between mb-3">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--worker-accent-hover)' }}>Total Earnings</h3>
            <DollarSign color="var(--worker-accent)" />
          </div>
          <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', lineHeight: '1', color: 'var(--worker-accent-hover)' }}>₹{earnings}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--worker-accent)', marginTop: '8px' }}>From {completedCount} completed jobs</p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between mb-3">
            <h3 style={{ fontSize: '1.1rem' }}>Profile Freshness</h3>
            <CheckCircle2 color="var(--worker-accent)" />
          </div>
          <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', lineHeight: '1' }}>Good</p>
          <Link to="/signup/worker" style={{ fontSize: '0.85rem', color: 'var(--worker-accent)', marginTop: '8px', display: 'inline-block', fontWeight: '500' }}>Update Profile →</Link>
        </div>
      </div>

      {/* Available Jobs Live Feed */}
      <div className="glass-panel">
        <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History size={20} /> Local Marketplace</h3>
        
        {availableJobs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>No jobs available right now. Check back later!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {availableJobs.map(job => (
              <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(45, 42, 38, 0.1)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--worker-bg-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={24} color="var(--worker-accent)" />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                      {job.service} <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>requested by {job.userName}</span>
                    </h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{job.description}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {job.userArea}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> Local Time: {job.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {quotingJobId === job.id ? (
                    <form onSubmit={(e) => handleProposePrice(e, job)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="number" name="price" placeholder="₹ Amount" required style={{ width: '100px', padding: '6px 8px' }} />
                      <button type="submit" className="btn btn-primary-worker" style={{ padding: '6px 12px' }}>Submit</button>
                      <button type="button" className="btn btn-outline" onClick={() => setQuotingJobId(null)} style={{ padding: '6px 12px' }}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0' }}>
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      <button onClick={() => setQuotingJobId(job.id)} className="btn btn-primary-worker" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                        Propose Price
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Accepted/Proposed Jobs Feed */}
      <div className="glass-panel mt-4">
        <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={20} /> My Jobs & Quotes</h3>
        
        {myJobs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>You haven't interacted with any jobs yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myJobs.map(job => (
              <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(45, 42, 38, 0.1)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: job.status === 'Completed' ? '#d1fae5' : 'var(--worker-bg-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} color={job.status === 'Completed' ? '#059669' : "var(--worker-accent)"} />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                      {job.service} {job.proposedPrice && <span style={{ color: 'var(--worker-accent)' }}>(₹{job.proposedPrice})</span>}
                    </h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>Client: {job.userName} • {job.userArea}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> Scheduled: {job.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                   <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold', 
                        background: job.status === 'Completed' ? '#d1fae5' : job.status === 'Confirmed' ? '#cffafe' : '#fef3c7', 
                        color: job.status === 'Completed' ? '#065f46' : job.status === 'Confirmed' ? '#164e63' : '#92400e' }}>
                    {job.status === 'Proposed' ? 'Quote Pending Approval' : job.status}
                  </span>
                  {job.status === 'Confirmed' && (
                    <button onClick={() => handleMarkCompleted(job.id)} className="btn btn-primary-worker" style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '8px' }}>
                      Mark as Completed
                    </button>
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
