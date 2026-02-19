import { useState } from 'react';
import styles from './App.module.css';
import DocumentUpload from './components/DocumentUpload';
import ResultsDisplay from './components/ResultsDisplay';

interface AnalysisResult {
  success?: boolean;
  filename?: string;
  toolType?: string;
  result?: any;
  error?: string;
  message?: string;
}

function App() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'financial' | 'earnings' | null>(null);

  const handleDocumentUpload = async (file: File, toolType: 'financial' | 'earnings') => {
    setLoading(true);
    setResults(null);
    setSelectedTool(toolType);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('toolType', toolType);

      const apiUrl = process.env.NODE_ENV === 'production' 
        ? `${window.location.origin}/api/process`
        : 'http://localhost:3001/api/process';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Failed to process document'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!results?.result?.lineItems) {
      alert('No data to download');
      return;
    }

    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? `${window.location.origin}/api/download-financial`
        : 'http://localhost:3001/api/download-financial';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: results.result })
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-data-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download Excel file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📊 Research Portal</h1>
        <p>Upload financial documents and extract analyst-ready insights</p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.uploadSection}>
          <DocumentUpload onUpload={handleDocumentUpload} isLoading={loading} />
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Processing document...</p>
          </div>
        )}

        {!loading && results && (
          <div className={styles.resultsSection}>
            <ResultsDisplay 
              results={results} 
              toolType={selectedTool}
              onDownloadExcel={handleDownloadExcel}
            />
          </div>
        )}

        {!loading && !results && (
          <div className={styles.emptyState}>
            <p>👈 Upload a document to get started</p>
            <p className={styles.emptySubtext}>Supported formats: PDF</p>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Research Portal v1.0 | Powered by AI-driven Document Analysis</p>
      </footer>
    </div>
  );
}

export default App;
