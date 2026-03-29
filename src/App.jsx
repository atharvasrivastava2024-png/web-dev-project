import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserLogin from './pages/UserLogin';
import WorkerLogin from './pages/WorkerLogin';
import UserForm from './pages/UserForm';
import WorkerForm from './pages/WorkerForm';
import UserDashboard from './pages/UserDashboard';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/login/worker" element={<WorkerLogin />} />
            <Route path="/signup/user" element={<UserForm />} />
            <Route path="/signup/worker" element={<WorkerForm />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/worker" element={<WorkerDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
