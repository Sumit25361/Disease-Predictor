import { useState, useEffect } from 'react';
import API from '../api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await API.get('/history');
                setHistory(res.data);
            } catch (err) {
                setError('Failed to fetch history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="container">Loading history...</div>;
    if (error) return <div className="container error-msg">{error}</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: '1rem' }}>
                <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    &larr; Back to Dashboard
                </a>
            </div>
            <h1>Patient History</h1>
            {history.length === 0 ? (
                <p>No history found.</p>
            ) : (
                <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map((item) => (
                        <div key={item.id} className="history-card" style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>{item.prediction}</span>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{new Date(item.timestamp).toLocaleString()}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>
                                Type: {item.type === 'image_prediction' ? 'Photo Analysis' : 'Symptom Check'}
                            </div>
                            {item.type === 'symptoms' && (
                                <details style={{ marginTop: '0.5rem' }}>
                                    <summary style={{ cursor: 'pointer', color: '#4b5563', fontWeight: 500 }}>View Symptoms</summary>
                                    <ul style={{ marginTop: '0.5rem', listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.25rem' }}>
                                        {Object.entries(item.input).map(([k, v]) => (
                                            <li key={k} style={{ color: v === 1 ? 'black' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: v === 1 ? '#10b981' : '#e5e7eb' }}></span>
                                                {k.replace(/_/g, ' ')}: {v === 1 ? 'Yes' : 'No'}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                            {item.type === 'image_prediction' && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    File: {item.filename}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
