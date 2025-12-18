import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePrediction, setImagePrediction] = useState(null);

    const [activeTab, setActiveTab] = useState(null);

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

    return (
        <div className="container">
            <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    Welcome, {localStorage.getItem('username') || 'User'}
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                    Your AI-powered health assistant. Choose an option below to get started.
                </p>
            </div>

            {/* Dashboard Cards Navigation */}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                {/* Symptom Checker Card */}
                <div
                    onClick={() => setActiveTab('symptoms')}
                    className={`feature-card ${activeTab === 'symptoms' ? 'active-card' : ''}`}
                    style={{
                        padding: '2rem',
                        borderRadius: '12px',
                        backgroundColor: activeTab === 'symptoms' ? 'var(--primary)' : 'white',
                        color: activeTab === 'symptoms' ? 'white' : '#333',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent',
                        borderColor: activeTab === 'symptoms' ? 'var(--primary)' : 'transparent'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🩺</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Symptom Checker</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                        Answer a few questions about how you feel to get an instant disease prediction.
                    </p>
                </div>

                {/* Photo Diagnosis Card */}
                <div
                    onClick={() => setActiveTab('photo')}
                    className={`feature-card ${activeTab === 'photo' ? 'active-card' : ''}`}
                    style={{
                        padding: '2rem',
                        borderRadius: '12px',
                        backgroundColor: activeTab === 'photo' ? 'var(--primary)' : 'white',
                        color: activeTab === 'photo' ? 'white' : '#333',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent',
                        borderColor: activeTab === 'photo' ? 'var(--primary)' : 'transparent'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📸</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Photo Diagnosis</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                        Upload a photo of a skin condition to get an AI analysis.
                    </p>
                </div>

                {/* History Card */}
                <div
                    onClick={() => navigate('/history')}
                    className="feature-card"
                    style={{
                        padding: '2rem',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        color: '#333',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>My History</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        View your past predictions and reports.
                    </p>
                </div>
            </div>

            {activeTab === 'symptoms' && (
                <div className="tab-content">
                    <h2>Check Symptoms</h2>
                    <p>Select your symptoms to get a prediction.</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Fever</label>
                                <select name="Fever" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cough</label>
                                <select name="Cough" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Fatigue</label>
                                <select name="Fatigue" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Difficulty Breathing</label>
                                <select name="Diff_Breathing" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Headache</label>
                                <select name="Headache" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Sore Throat</label>
                                <select name="Sore_Throat" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Body Aches</label>
                                <select name="Body_Aches" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Runny Nose</label>
                                <select name="Runny_Nose" onChange={handleChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Predict Disease</button>
                    </form>

                    {prediction && (
                        <div className="prediction-report" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                            <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Prediction Report</h3>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <p><strong>Patient Name:</strong> {localStorage.getItem('username') || 'User'}</p>
                                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                <p><strong>Disease Predicted:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{prediction}</span></p>

                                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Symptoms Reported:</h4>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                    {Object.entries(formData).map(([key, value]) => (
                                        <li key={key} style={{ padding: '0.5rem', backgroundColor: value === 1 ? '#e0f2fe' : '#f3f4f6', borderRadius: '4px', border: value === 1 ? '1px solid #7dd3fc' : '1px solid transparent' }}>
                                            <span style={{ fontWeight: 500 }}>{key.replace(/_/g, ' ')}:</span> {value === 1 ? 'Yes' : 'No'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <button onClick={() => window.print()} className="btn" style={{ backgroundColor: '#6b7280' }}>Print Report</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'photo' && (
                <div className="tab-content">
                    <h2>Upload Photo</h2>
                    <p>Upload a clear photo of the skin issue for AI analysis.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '2rem', border: '2px dashed #ddd', borderRadius: '8px' }}>
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
                                    style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                />
                            </div>
                        )}

                        <button
                            onClick={handleImageUpload}
                            className="btn"
                            style={{ backgroundColor: '#10b981', maxWidth: '300px' }}
                            disabled={!imageFile}
                        >
                            Analyze Photo
                        </button>
                    </div>

                    {imagePrediction && (
                        <div className="prediction-report" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #10b981', borderRadius: '8px', backgroundColor: '#ecfdf5' }}>
                            <h3 style={{ borderBottom: '2px solid #10b981', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Photo Diagnosis Report</h3>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <p><strong>Patient Name:</strong> {localStorage.getItem('username') || 'User'}</p>
                                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                <p><strong>Detected Infection:</strong> <span style={{ color: '#059669', fontWeight: 'bold' }}>{imagePrediction}</span></p>

                                <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#555' }}>
                                    Note: This analysis is based on the uploaded image. Results are for informational purposes mainly.
                                </p>
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <button onClick={() => window.print()} className="btn" style={{ backgroundColor: '#6b7280' }}>Print Report</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="error-msg" style={{ marginTop: '1rem' }}>{error}</p>}
            {/* About Section */}
            <div style={{ backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '8px', marginTop: '3rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#4b5563' }}>ℹ️  About this App</h4>
                <p style={{ margin: 0 }}>
                    This application uses Machine Learning to assess symptoms and analyze skin images.
                    It serves as a preliminary screening tool and is <strong>not a substitute for professional medical advice</strong>.
                </p>
            </div>
        </div>
    );
};

export default Home;
