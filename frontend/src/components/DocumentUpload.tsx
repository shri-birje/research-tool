import React, { useRef, useState } from 'react';
import styles from './DocumentUpload.module.css';

interface DocumentUploadProps {
  onUpload: (file: File, toolType: 'financial' | 'earnings') => void;
  isLoading: boolean;
}

export default function DocumentUpload({ onUpload, isLoading }: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTool, setSelectedTool] = useState<'financial' | 'earnings'>('financial');
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('File is too large (max 50MB)');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
    onUpload(selectedFile, selectedTool);
  };

  return (
    <div className={styles.card}>
      <h2>📁 Upload Document</h2>
      
      <div className={styles.toolSelection}>
        <label className={styles.toolLabel}>
          <input
            type="radio"
            value="financial"
            checked={selectedTool === 'financial'}
            onChange={(e) => setSelectedTool(e.target.value as 'financial' | 'earnings')}
            disabled={isLoading}
          />
          <span>💰 Financial Statement Extraction</span>
        </label>
        <p className={styles.toolDescription}>Extract income statement line items to Excel</p>

        <label className={styles.toolLabel}>
          <input
            type="radio"
            value="earnings"
            checked={selectedTool === 'earnings'}
            onChange={(e) => setSelectedTool(e.target.value as 'financial' | 'earnings')}
            disabled={isLoading}
          />
          <span>📞 Earnings Call Analysis</span>
        </label>
        <p className={styles.toolDescription}>Analyze management tone, guidance, and initiatives</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div
          className={`${styles.dropZone} ${dragActive ? styles.active : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            disabled={isLoading}
            hidden
          />
          
          {!selectedFile ? (
            <>
              <p className={styles.dropText}>Drop PDF here or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.browseBtn}
                disabled={isLoading}
              >
                Browse Files
              </button>
              <p className={styles.hint}>PDF up to 50MB</p>
            </>
          ) : (
            <>
              <p className={styles.selectedFile}>✓ {selectedFile.name}</p>
              <p className={styles.fileSize}>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className={styles.changeBtn}
                disabled={isLoading}
              >
                Choose Different File
              </button>
            </>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Processing...' : 'Analyze Document'}
        </button>
      </form>
    </div>
  );
}
