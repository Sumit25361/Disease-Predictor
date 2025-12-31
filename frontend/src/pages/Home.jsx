import { useState, useEffect, useRef } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Fever: 0,
        Cough: 0,
        Fatigue: 0,
        Diff_Breathing: 0,
        Headache: 0,
        Sore_Throat: 0,
        Body_Aches: 0,
        Runny_Nose: 0
    });
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');

    // Smooth scroll ref
    const formSectionRef = useRef(null);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePrediction, setImagePrediction] = useState(null);
    const [showReport, setShowReport] = useState(false);

    const [activeTab, setActiveTab] = useState(null);

    // Scroll to form when tab changes
    useEffect(() => {
        if (activeTab && formSectionRef.current) {
            setTimeout(() => {
                formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [activeTab]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setImagePrediction(null);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const res = await API.post('/predict-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImagePrediction(res.data.prediction);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Image analysis failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/predict', formData);
            setPrediction(res.data.prediction);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Prediction failed');
        }
    };

    const clearSelection = () => {
        setActiveTab(null);
        setPrediction(null);
        setImagePrediction(null);
        setShowReport(false); // Also clear report visibility
        setImageFile(null); // Clear image file
        setImagePreview(null); // Clear image preview
    };

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    Welcome, {localStorage.getItem('username') || 'User'}
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                    Your AI-powered health assistant. Follow the steps below.
                </p>
            </div>

            {/* Step 1 Indicator */}
            <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step 1: Choose a Service
            </div>

            {/* Dashboard Cards Navigation */}
            <div className="dashboard-grid">

                {/* Symptom Checker Card */}
                <div
                    onClick={() => setActiveTab('symptoms')}
                    className={`feature-card ${activeTab === 'symptoms' ? 'active-card' : ''}`}
                    style={{
                        backgroundColor: activeTab === 'symptoms' ? 'var(--primary)' : 'white',
                        color: activeTab === 'symptoms' ? 'white' : '#333',
                        borderColor: activeTab === 'symptoms' ? 'var(--primary)' : 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🩺</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Symptom Checker</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                        Answer a few questions about how you feel to get an instant disease prediction.
                    </p>
                    {activeTab === 'symptoms' && <div style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>👇</div>}
                </div>

                {/* Photo Diagnosis Card */}
                <div
                    onClick={() => setActiveTab('photo')}
                    className={`feature-card ${activeTab === 'photo' ? 'active-card' : ''}`}
                    style={{
                        backgroundColor: activeTab === 'photo' ? 'var(--primary)' : 'white',
                        color: activeTab === 'photo' ? 'white' : '#333',
                        borderColor: activeTab === 'photo' ? 'var(--primary)' : 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📸</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Photo Diagnosis</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                        Upload a photo of a skin condition to get an AI analysis.
                    </p>
                    {activeTab === 'photo' && <div style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>👇</div>}
                </div>

                {/* History Card */}
                <div
                    onClick={() => navigate('/history')}
                    className="feature-card"
                    style={{
                        backgroundColor: 'white',
                        color: '#333',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>My History</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        View your past predictions and reports.
                    </p>
                </div>
            </div>

            {/* Content Section with Ref for scrolling */}
            <div ref={formSectionRef}>
                {activeTab && (
                    <div style={{
                        marginTop: '3rem',
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                        position: 'relative',
                        borderTop: '4px solid var(--primary)'
                    }}>
                        <button
                            onClick={clearSelection}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Close"
                        >
                            &times;
                        </button>

                        <div style={{ marginBottom: '1.5rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Step 2: Provide Details
                        </div>

                        {activeTab === 'symptoms' && (
                            <div className="tab-content fade-in">
                                <h2 style={{ marginBottom: '0.5rem' }}>Check Symptoms</h2>
                                <p style={{ marginBottom: '2rem', color: '#666' }}>Select 'Yes' for symptoms you are experiencing.</p>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                                        {Object.keys(formData).map((key) => (
                                            <div key={key} className="form-group" style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                                    {key.replace(/_/g, ' ')}
                                                </label>
                                                <select
                                                    name={key}
                                                    onChange={handleChange}
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                                >
                                                    <option value="0">No</option>
                                                    <option value="1">Yes</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem' }}>
                                            Analyze Symptoms
                                        </button>
                                    </div>
                                </form>

                                {prediction && !showReport && (
                                    <div className="prediction-result" style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', backgroundColor: '#eef2ff', borderRadius: '8px' }}>
                                        <h3 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '1rem' }}>Result: {prediction}</h3>
                                        <button
                                            onClick={() => setShowReport(true)}
                                            className="btn"
                                            style={{ backgroundColor: 'white', color: 'var(--primary)', border: '1px solid var(--primary)' }}
                                        >
                                            View Detailed Report
                                        </button>
                                    </div>
                                )}

                                {showReport && prediction && (
                                    <div className="printable-area" style={{ marginTop: '2rem', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
                                        <div className="no-print" style={{ marginBottom: '1rem' }}>
                                            <button onClick={() => setShowReport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                                                &larr; Back
                                            </button>
                                        </div>

                                        <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Medical Prediction Report</h3>
                                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                                            <p><strong>Patient Name:</strong> {localStorage.getItem('username') || 'User'}</p>
                                            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                            <p style={{ fontSize: '1.1rem' }}><strong>Predicted Condition:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{prediction}</span></p>

                                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Symptoms Analysis:</h4>
                                            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                                {Object.entries(formData).map(([key, value]) => (
                                                    <li key={key} style={{ padding: '0.5rem', backgroundColor: value === 1 ? '#e0f2fe' : '#f3f4f6', borderRadius: '4px', border: value === 1 ? '1px solid #7dd3fc' : '1px solid transparent', color: value === 1 ? '#0369a1' : '#6b7280' }}>
                                                        <span style={{ fontWeight: 500 }}>{key.replace(/_/g, ' ')}:</span> {value === 1 ? 'Detected' : 'Clear'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="no-print" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                            <button onClick={() => window.print()} className="btn" style={{ backgroundColor: '#4b5563' }}>Print Report</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'photo' && (
                            <div className="tab-content fade-in">
                                <h2 style={{ marginBottom: '0.5rem' }}>Upload Photo</h2>
                                <p style={{ marginBottom: '2rem', color: '#666' }}>Upload a clear photo of the skin issue for AI analysis.</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '3rem', border: '2px dashed #ccc', borderRadius: '12px', backgroundColor: '#fafafa' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ padding: '0.5rem' }}
                                    />

                                    {imagePreview && (
                                        <div style={{ margin: '1rem 0' }}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={handleImageUpload}
                                        className="btn"
                                        style={{ backgroundColor: '#10b981', minWidth: '200px', fontSize: '1.1rem' }}
                                        disabled={!imageFile}
                                    >
                                        Analyze Photo
                                    </button>
                                </div>

                                {imagePrediction && !showReport && (
                                    <div className="prediction-result" style={{ borderLeft: '5px solid #10b981', backgroundColor: '#ecfdf5', marginTop: '2rem', padding: '1.5rem', borderRadius: '4px' }}>
                                        <h3 style={{ color: '#059669', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Detected: {imagePrediction}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>This is an AI estimation. Please consult a dermatologist.</p>
                                        <button
                                            onClick={() => setShowReport(true)}
                                            className="btn"
                                            style={{ marginTop: '1rem', backgroundColor: '#10b981' }}
                                        >
                                            Generate Report
                                        </button>
                                    </div>
                                )}

                                {showReport && imagePrediction && (
                                    <div className="printable-area" style={{ marginTop: '2rem', padding: '2rem', border: '1px solid #10b981', borderRadius: '8px', backgroundColor: '#ecfdf5' }}>
                                        <div className="no-print" style={{ marginBottom: '1rem' }}>
                                            <button onClick={() => setShowReport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                                                &larr; Back
                                            </button>
                                        </div>

                                        <h3 style={{ borderBottom: '2px solid #10b981', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Photo Diagnosis Report</h3>
                                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                                            <p><strong>Patient Name:</strong> {localStorage.getItem('username') || 'User'}</p>
                                            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                            <p style={{ fontSize: '1.1rem' }}><strong>Detected Infection:</strong> <span style={{ color: '#059669', fontWeight: 'bold' }}>{imagePrediction}</span></p>

                                            <p style={{ marginTop: '1.5rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#555' }}>
                                                Note: This analysis is based on the uploaded image. Results are for informational purposes mainly.
                                            </p>
                                        </div>
                                        <div className="no-print" style={{ marginTop: '2rem', borderTop: '1px solid #a7f3d0', paddingTop: '1rem' }}>
                                            <button onClick={() => window.print()} className="btn" style={{ backgroundColor: '#4b5563' }}>Print Report</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && <div className="error-msg" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

            {/* About Section */}
            {!activeTab && (
                <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px', marginTop: '4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>ℹ️  Medical Disclaimer</h4>
                    <p style={{ margin: 0, color: '#94a3b8' }}>
                        This application is for educational purposes only. Always seek the advice of your physician or other qualified health provider.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
