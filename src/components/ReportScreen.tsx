import React, { useState, useEffect } from 'react';
import { TestResult, TestStatus, ScanMode } from '../types';
import { generateReportSummary, ReportSummary } from '../services/geminiService';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ReportScreenProps {
  results: TestResult[];
  scanMode: ScanMode;
  onGoHome: () => void;
}

const statusInfo: { [key in TestStatus]?: { color: string; icon: React.ReactNode } } = {
  [TestStatus.Pass]: { color: 'text-green-500', icon: <CheckCircleIcon className="w-5 h-5" /> },
  [TestStatus.Warning]: { color: 'text-yellow-500', icon: <ExclamationTriangleIcon className="w-5 h-5" /> },
  [TestStatus.Critical]: { color: 'text-red-500', icon: <XCircleIcon className="w-5 h-5" /> },
};

const ReportScreen: React.FC<ReportScreenProps> = ({ results, scanMode, onGoHome }) => {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      const generatedReport = await generateReportSummary(results);
      setReport(generatedReport);
      setIsLoading(false);
    };
    fetchSummary();
  }, [results]);

  const criticals = results.filter(r => r.status === TestStatus.Critical).length;
  const warnings = results.filter(r => r.status === TestStatus.Warning).length;

  const overallStatus = criticals > 0 ? 'Critical Issues Found' : warnings > 0 ? 'Warnings Detected' : 'All Systems Nominal';
  const overallStatusColor = criticals > 0 ? 'text-red-500' : warnings > 0 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="bg-brand-gray-dark border border-brand-gray-light rounded-lg p-8 w-full print-bg-white print-border">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold">Diagnostic Report</h2>
          <p className="text-gray-400">Results for: {scanMode}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">Overall Status</p>
          <p className={`font-bold text-2xl ${overallStatusColor}`}>{overallStatus}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Panel: AI Summary */}
        <div className="bg-brand-dark p-6 rounded-lg print-bg-white print-border">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-brand-blue">Analysis &amp; Recommendations</h3>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <SpinnerIcon className="w-12 h-12 text-brand-blue" />
              <p className="ml-4 text-gray-300">Analyzing results...</p>
            </div>
          ) : (
            <div className="text-gray-300 whitespace-pre-wrap font-sans leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: report?.summary.replace(/\n/g, '<br />') ?? '' }} />
          )}
        </div>

        {/* Right Panel: Raw Results */}
        <div className="bg-brand-dark p-6 rounded-lg h-[60vh] overflow-y-auto print-bg-white print-border">
          <h3 className="text-xl font-bold mb-4">Detailed Test Results</h3>
          <ul className="space-y-2 font-mono text-xs">
            {results.map(({ test, status, details, rawData }, index) => {
              const info = statusInfo[status];
              if (!info) return null;
              return (
                <li key={index} className="flex items-center justify-between p-2 rounded bg-brand-gray-medium print-bg-white print-border">
                  <div className="flex items-center flex-grow">
                    <span className={`mr-2 ${info.color}`}>{info.icon}</span>
                    <span className="text-gray-300 mr-2">{test.name}:</span>
                    <span className={`font-medium ${info.color} flex-shrink min-w-0`}>{details}</span>
                  </div>
                  {rawData && <span className="text-xs text-gray-500 bg-brand-dark px-2 py-1 rounded ml-2">{`RAW: ${rawData}`}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-4 no-print">
        <button onClick={() => window.print()} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors">Print Report</button>
        <button onClick={onGoHome} className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition-colors">Start New Scan</button>
      </div>
    </div>
  );
};

export default ReportScreen;