import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import ScanningScreen from './components/ScanningScreen';
import ReportScreen from './components/ReportScreen';
import { ScanMode, TestResult, Screen } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedScanMode, setSelectedScanMode] = useState<ScanMode | null>(null);
  const [scanResults, setScanResults] = useState<TestResult[]>([]);

  const handleScanStart = useCallback((mode: ScanMode) => {
    setSelectedScanMode(mode);
    setScanResults([]);
    setCurrentScreen('scanning');
  }, []);

  const handleScanComplete = useCallback((results: TestResult[]) => {
    setScanResults(results);
    setCurrentScreen('report');
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedScanMode(null);
    setScanResults([]);
    setCurrentScreen('home');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'scanning':
        return (
          <ScanningScreen
            scanMode={selectedScanMode!}
            onScanComplete={handleScanComplete}
            onCancel={handleGoHome}
          />
        );
      case 'report':
        return <ReportScreen results={scanResults} onGoHome={handleGoHome} scanMode={selectedScanMode!}/>;
      case 'home':
      default:
        return <HomeScreen onScanStart={handleScanStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto printable-area">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
