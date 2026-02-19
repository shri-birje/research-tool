import styles from './ResultsDisplay.module.css';

interface ResultsDisplayProps {
  results: any;
  toolType: 'financial' | 'earnings' | null;
  onDownloadExcel?: () => void;
}

export default function ResultsDisplay({ results, toolType, onDownloadExcel }: ResultsDisplayProps) {
  if (results.error) {
    return (
      <div className={styles.errorCard}>
        <h3>❌ Error</h3>
        <p className={styles.errorMessage}>{results.error}</p>
        {results.message && <p className={styles.details}>{results.message}</p>}
      </div>
    );
  }

  if (!results.result) {
    return <div className={styles.loadingMessage}>Processing results...</div>;
  }

  const data = results.result;

  if (toolType === 'financial') {
    return (
      <div className={styles.card}>
        <h2>💰 Financial Statement Extraction Results</h2>
        
        <div className={styles.section}>
          <h3>Document Summary</h3>
          <p>{data.documentSummary}</p>
          {data.yearsFound && data.yearsFound.length > 0 && (
            <p>Years found: <strong>{data.yearsFound.join(', ')}</strong></p>
          )}
        </div>

        {data.warnings && data.warnings.length > 0 && (
          <div className={styles.warningsSection}>
            <h3>⚠️ Warnings & Notes</h3>
            <ul>
              {data.warnings.map((warning: string, idx: number) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.tableSection}>
          <h3>Extracted Line Items</h3>
          {data.lineItems && data.lineItems.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Line Item</th>
                    <th>Value</th>
                    <th>Currency</th>
                    <th>Unit</th>
                    <th>Period</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lineItems.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td>{item.category}</td>
                      <td>{item.lineItem}</td>
                      <td className={item.value === null ? styles.missing : ''}>
                        {item.value !== null ? item.value.toLocaleString() : 'Not found'}
                      </td>
                      <td>{item.currency || '-'}</td>
                      <td>{item.unit || '-'}</td>
                      <td>{item.period || '-'}</td>
                      <td>
                        <span className={`${styles.confidence} ${styles[item.confidence]}`}>
                          {item.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.noData}>No line items extracted</p>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={onDownloadExcel} className={styles.downloadBtn}>
            ⬇️ Download as Excel
          </button>
        </div>
      </div>
    );
  }

  if (toolType === 'earnings') {
    return (
      <div className={styles.card}>
        <h2>📞 Earnings Call Analysis Results</h2>

        <div className={styles.toneSection}>
          <h3>Management Tone & Sentiment</h3>
          <div className={styles.toneCard}>
            <p className={styles.toneValue}>
              <span className={`${styles.toneBadge} ${styles[data.managementTone]}`}>
                {data.managementTone?.toUpperCase()}
              </span>
            </p>
            <p className={styles.toneConfidence}>
              Confidence: <strong>{data.confidenceLevel}</strong>
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h3>✅ Key Positives</h3>
          {data.keyPositives && data.keyPositives.length > 0 ? (
            <ul>
              {data.keyPositives.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>No positives identified</p>
          )}
        </div>

        <div className={styles.section}>
          <h3>⚠️ Key Concerns</h3>
          {data.keyConcerns && data.keyConcerns.length > 0 ? (
            <ul>
              {data.keyConcerns.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>No concerns identified</p>
          )}
        </div>

        {data.forwardGuidance && Object.keys(data.forwardGuidance).length > 0 && (
          <div className={styles.section}>
            <h3>📈 Forward Guidance</h3>
            <div className={styles.guidanceGrid}>
              {data.forwardGuidance.revenue && (
                <div className={styles.guidanceItem}>
                  <strong>Revenue:</strong> {data.forwardGuidance.revenue}
                </div>
              )}
              {data.forwardGuidance.margin && (
                <div className={styles.guidanceItem}>
                  <strong>Margin:</strong> {data.forwardGuidance.margin}
                </div>
              )}
              {data.forwardGuidance.capex && (
                <div className={styles.guidanceItem}>
                  <strong>CapEx:</strong> {data.forwardGuidance.capex}
                </div>
              )}
              {data.forwardGuidance.other && data.forwardGuidance.other.length > 0 && (
                <div className={styles.guidanceItem}>
                  <strong>Other:</strong> {data.forwardGuidance.other.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {data.capacityUtilization && (
          <div className={styles.section}>
            <h3>🏭 Capacity Utilization</h3>
            <p>{data.capacityUtilization}</p>
          </div>
        )}

        {data.growthInitiatives && data.growthInitiatives.length > 0 && (
          <div className={styles.section}>
            <h3>🚀 Growth Initiatives</h3>
            <ul>
              {data.growthInitiatives.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.dataQuality && data.dataQuality.length > 0 && (
          <div className={styles.warningsSection}>
            <h3>ℹ️ Data Quality Notes</h3>
            <ul>
              {data.dataQuality.map((note: string, idx: number) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {data.warnings && data.warnings.length > 0 && (
          <div className={styles.warningsSection}>
            <h3>⚠️ Warnings</h3>
            <ul>
              {data.warnings.map((warning: string, idx: number) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return <div className={styles.loadingMessage}>Unable to display results</div>;
}
