import { Link } from 'react-router-dom';
import { User, Wrench } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="container">
      <div className="text-center mb-4 mt-4">
        <h1>Local Skills</h1>
        <p>Your neighborhood service marketplace.</p>
      </div>

      <div className="grid-2">
        {/* User Card */}
        <div className="glass-panel text-center user-theme">
          <div className="mb-3">
            <User size={64} color="var(--user-accent)" />
          </div>
          <h2 className="mb-2">Need a Hand?</h2>
          <p className="mb-4">Find trusted local workers for your home repairs, cleaning, and installations.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/login/user" className="btn btn-primary-user">
              Continue as User
            </Link>
            <Link to="/signup/user" className="btn btn-outline btn-outline-user">
              Create User Account
            </Link>
          </div>
        </div>

        {/* Worker Card */}
        <div className="glass-panel text-center worker-theme">
          <div className="mb-3">
            <Wrench size={64} color="var(--worker-accent)" />
          </div>
          <h2 className="mb-2">Offer Your Skills</h2>
          <p className="mb-4">Connect with locals who need your expertise, set your own schedule, and earn.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/login/worker" className="btn btn-primary-worker">
              Continue as Worker
            </Link>
            <Link to="/signup/worker" className="btn btn-outline btn-outline-worker">
              Create Worker Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
