import React, { useState, useRef } from 'react';
import './App.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ThemeToggle from './ThemeToggle';

function App() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const reportRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, apiKey }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unknown error');

      setResult(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('seo-report.pdf');
  };

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <div className="container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>SEO Optimization Analyzer</h1>
        <p className="subtitle">Using Google PageSpeed Insights API</p>

        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter Website URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <input type="text" placeholder="Google API Key (optional)" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Run SEO Audit'}
          </button>
        </form>

        {error && <p className="error">❌ {error}</p>}

        {result && (
          <div className="results fade-in" ref={reportRef}>
            <h2>
              SEO Score: <span className={`score score-${getScoreColor(result.score)}`}>{result.score}</span>
            </h2>
            <h3>Recommendations:</h3>
            {result.suggestions.map((sug, i) => (
              <div className="card" key={i}>
                <strong>{sug.title}</strong>
                <p>{sug.description}</p>
              </div>
            ))}
          </div>
        )}

        {result && (
          <button className="download-btn" onClick={downloadPDF}>📄 Export PDF</button>
        )}

        <footer className="footer">© {new Date().getFullYear()} SEO Analyzer by Shivam Yadav 🚀</footer>
      </div>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 90) return 'green';
  if (score >= 50) return 'orange';
  return 'red';
}

export default App;
