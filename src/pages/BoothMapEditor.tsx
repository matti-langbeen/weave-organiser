import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { EventType, Booth, Company } from '../types';
import { getEventById, updateEvent } from '../services/eventService';
import { getCompanies } from '../services/companyService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './BoothMapEditor.css';

const BoothMapEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [event, setEvent] = useState<EventType | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [booths, setBooths] = useState<Booth[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [draggedBooth, setDraggedBooth] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [floorPlanUrl, setFloorPlanUrl] = useState<string>('');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [eventData, companiesData] = await Promise.all([
          getEventById(id),
          getCompanies()
        ]);
        
        if (!eventData) {
          setError('Event not found');
          return;
        }

        setEvent(eventData);
        setCompanies(companiesData);
        setBooths(eventData.booths || []);
        setFloorPlanUrl(eventData.floorPlan?.imageUrl || eventData.floorPlan?.imageData || '');
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddBooth = () => {
    const newBooth: Booth = {
      id: `booth-${Date.now()}`,
      number: `${booths.length + 1}`,
      x: 100,
      y: 100,
      width: 120,
      height: 120
    };
    setBooths([...booths, newBooth]);
  };

  const handleMouseDown = (boothId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const booth = booths.find(b => b.id === boothId);
    if (!booth) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDraggedBooth(boothId);
    setSelectedBooth(boothId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedBooth || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - canvasRect.left) / zoom - dragOffset.x;
    const newY = (e.clientY - canvasRect.top) / zoom - dragOffset.y;

    setBooths(booths.map(booth =>
      booth.id === draggedBooth
        ? { ...booth, x: Math.max(0, newX), y: Math.max(0, newY) }
        : booth
    ));
  };

  const handleMouseUp = () => {
    setDraggedBooth(null);
  };

  const handleDeleteBooth = (boothId: string) => {
    setBooths(booths.filter(b => b.id !== boothId));
    if (selectedBooth === boothId) {
      setSelectedBooth(null);
    }
  };

  const handleAssignCompany = (boothId: string, companyId: string) => {
    setBooths(booths.map(booth =>
      booth.id === boothId
        ? { ...booth, companyId: companyId || undefined }
        : booth
    ));
  };

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFloorPlanUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  const handleSave = async () => {
    if (!id || !event) return;

    try {
      setSaving(true);
      const updatedEvent: EventType = {
        ...event,
        booths,
        floorPlan: {
          imageData: floorPlanUrl.startsWith('data:') ? floorPlanUrl : undefined,
          imageUrl: !floorPlanUrl.startsWith('data:') ? floorPlanUrl : undefined,
          width: 1200,
          height: 800
        }
      };
      
      await updateEvent(id, updatedEvent);
      navigate(`/events/${id}`);
    } catch (err) {
      console.error('Error saving booth map:', err);
      alert('Failed to save booth map. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-container">
        <EmptyState message={error || 'Event not found'} />
      </div>
    );
  }

  const selectedBoothData = booths.find(b => b.id === selectedBooth);

  return (
    <div className="page-container">
      <Link to={`/events/${id}`} className="back-link">← Back to Event</Link>
      
      <div className="booth-map-editor">
        <div className="editor-header">
          <div>
            <h1>Booth Map - {event.name}</h1>
            <p>Drag booths to position them on your floor plan</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate(`/events/${id}`)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Map'}
            </button>
          </div>
        </div>

        <div className="editor-layout">
          <div className="editor-sidebar">
            <div className="sidebar-section">
              <h3>Floor Plan</h3>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFloorPlanUpload}
                style={{ display: 'none' }}
              />
              <button 
                className="btn btn-secondary btn-full"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Upload Floor Plan
              </button>
              {floorPlanUrl && (
                <button 
                  className="btn btn-secondary btn-full"
                  onClick={() => setFloorPlanUrl('')}
                >
                  ✕ Remove Floor Plan
                </button>
              )}
            </div>

            <div className="sidebar-section">
              <h3>Booths ({booths.length})</h3>
              <button className="btn btn-primary btn-full" onClick={handleAddBooth}>
                + Add Booth
              </button>
              
              {selectedBoothData && (
                <div className="booth-details">
                  <h4>Booth #{selectedBoothData.number}</h4>
                  <div className="form-group">
                    <label>Booth Number</label>
                    <input
                      type="text"
                      value={selectedBoothData.number}
                      onChange={(e) => {
                        setBooths(booths.map(b =>
                          b.id === selectedBooth ? { ...b, number: e.target.value } : b
                        ));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Assign Company</label>
                    <select
                      value={selectedBoothData.companyId || ''}
                      onChange={(e) => selectedBooth && handleAssignCompany(selectedBooth, e.target.value)}
                    >
                      <option value="">-- No Company --</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-danger btn-full"
                    onClick={() => selectedBooth && handleDeleteBooth(selectedBooth)}
                  >
                    Delete Booth
                  </button>
                </div>
              )}
            </div>

            <div className="sidebar-section">
              <h3>Companies</h3>
              <div className="company-list">
                {companies.map(company => {
                  const assignedBooth = booths.find(b => b.companyId === company.id);
                  return (
                    <div key={company.id} className="company-item">
                      <div className="company-info">
                        {company.logo && <img src={company.logo} alt={company.name} />}
                        <span>{company.name}</span>
                      </div>
                      {assignedBooth && (
                        <span className="booth-badge">Booth #{assignedBooth.number}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="editor-canvas-container">
            <div className="zoom-controls">
              <button 
                className="zoom-btn" 
                onClick={handleZoomOut}
                title="Zoom Out"
                disabled={zoom <= 0.3}
              >
                −
              </button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button 
                className="zoom-btn" 
                onClick={handleZoomIn}
                title="Zoom In"
                disabled={zoom >= 2}
              >
                +
              </button>
              <button 
                className="zoom-btn zoom-reset" 
                onClick={handleZoomReset}
                title="Reset Zoom"
              >
                ⟲
              </button>
            </div>

            <div
              ref={canvasRef}
              className="editor-canvas"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {floorPlanUrl && (
                <img src={floorPlanUrl} alt="Floor plan" className="floor-plan-image" />
              )}
              
              {booths.map(booth => {
                const company = companies.find(c => c.id === booth.companyId);
                return (
                  <div
                    key={booth.id}
                    className={`booth ${selectedBooth === booth.id ? 'selected' : ''} ${booth.companyId ? 'assigned' : ''}`}
                    style={{
                      left: `${booth.x}px`,
                      top: `${booth.y}px`,
                      width: `${booth.width}px`,
                      height: `${booth.height}px`
                    }}
                    onMouseDown={(e) => handleMouseDown(booth.id, e)}
                    onClick={() => setSelectedBooth(booth.id)}
                  >
                    <div className="booth-number">#{booth.number}</div>
                    {company && (
                      <div className="booth-company">
                        {company.logo && <img src={company.logo} alt={company.name} />}
                        <span>{company.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothMapEditor;
