import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrganizerProvider } from './contexts/OrganizerContext';
import Header from './components/Header';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CompanyDetail from './pages/CompanyDetail';
import StudentProfile from './pages/StudentProfile';
import './App.css';

function App() {
  return (
    <OrganizerProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/edit" element={<EventDetail editMode />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/students/:id" element={<StudentProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </OrganizerProvider>
  );
}

export default App;
