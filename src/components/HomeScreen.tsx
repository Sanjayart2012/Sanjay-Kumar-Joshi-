
import React from 'react';
import { ScanMode } from '../types';

interface HomeScreenProps {
  onScanStart: (mode: ScanMode) => void;
}

const ScanCard: React.FC<{ title: string, description: string, duration: string, onClick: () => void }> = ({ title, description, duration, onClick }) => (
  <button
    onClick={onClick}
    className="bg-brand-gray-dark border border-brand-gray-light rounded-lg p-6 text-left hover:border-brand-blue transition-all duration-300 flex flex-col h-full"
  >
    <h3 className="text-xl font-bold text-brand-blue">{title}</h3>
    <p className="text-gray-400 mt-2 flex-grow">{description}</p>
    <p className="text-sm text-gray-500 font-mono mt-4">Est. time: {duration}</p>
  </button>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onScanStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-2">PC Health Doctor</h1>
      <p className="text-lg text-gray-400 mb-12">Select a diagnostic scan to begin troubleshooting your PC.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <ScanCard
          title={ScanMode.Quick}
          description="A fast, customer-facing scan for a basic health summary. Checks key system vitals."
          duration="60-90s"
          onClick={() => onScanStart(ScanMode.Quick)}
        />
        <ScanCard
          title={ScanMode.Full}
          description="In-depth hardware and software checks. Recommended before starting any repairs."
          duration="5-20 min"
          onClick={() => onScanStart(ScanMode.Full)}
        />
        <ScanCard
          title={ScanMode.Deep}
          description="Forensic-level stress tests for memory, disk surface, and firmware. For complex issues."
          duration="30-120+ min"
          onClick={() => onScanStart(ScanMode.Deep)}
        />
        <ScanCard
          title={ScanMode.Motherboard}
          description="A specialized sequence to detect board-level faults using POST analysis and sensor data."
          duration="15-45 min"
          onClick={() => onScanStart(ScanMode.Motherboard)}
        />
      </div>
    </div>
  );
};

export default HomeScreen;