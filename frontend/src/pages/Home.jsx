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

    const [activeTab, setActiveTab] = useState('symptoms');

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
            <h1>Disease Predictor</h1>

            <div className="tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
                <button
                    onClick={() => setActiveTab('symptoms')}
                    className={`tab-btn ${activeTab === 'symptoms' ? 'active' : ''}`}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'symptoms' ? '3px solid var(--primary)' : '3px solid transparent',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: activeTab === 'symptoms' ? 'var(--primary)' : '#666'
                    }}
                >
                    Symptom Checker
                </button>
                <button
                    onClick={() => setActiveTab('photo')}
                    className={`tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'photo' ? '3px solid var(--primary)' : '3px solid transparent',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: activeTab === 'photo' ? 'var(--primary)' : '#666'
                    }}
                >
                    Photo Diagnosis
                </button>
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
        </div>
    );
};

export default Home;
