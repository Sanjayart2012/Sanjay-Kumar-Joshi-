import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScanMode, TestResult, DiagnosticTest, TestStatus } from '../types';
import { SCAN_MODES_TESTS } from '../constants';
import { CpuIcon } from './icons/CpuIcon';
import { RamIcon } from './icons/RamIcon';
import { DiskIcon } from './icons/DiskIcon';
import { GpuIcon } from './icons/GpuIcon';
import { MotherboardIcon } from './icons/MotherboardIcon';
import { BatteryIcon } from './icons/BatteryIcon';
import { NetworkIcon } from './icons/NetworkIcon';
import { PowerIcon } from './icons/PowerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';


interface ScanningScreenProps {
  scanMode: ScanMode;
  onScanComplete: (results: TestResult[]) => void;
  onCancel: () => void;
}

const componentIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  CPU: CpuIcon,
  RAM: RamIcon,
  Storage: DiskIcon,
  GPU: GpuIcon,
  Motherboard: MotherboardIcon,
  Battery: BatteryIcon,
  Network: NetworkIcon,
  PSU: PowerIcon,
  System: DiskIcon,
};

const statusIcons: { [key in TestStatus]: React.ReactNode } = {
    [TestStatus.Pending]: <div className="w-5 h-5 border-2 border-gray-500 rounded-full" />,
    [TestStatus.Running]: <SpinnerIcon className="w-5 h-5 text-brand-blue" />,
    [TestStatus.Pass]: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    [TestStatus.Warning]: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />,
    [TestStatus.Critical]: <XCircleIcon className="w-5 h-5 text-red-500" />,
};

const mockResultDetails: { [key: string]: { pass: string, warn: string, crit: string } } = {
    'default': { pass: 'OK', warn: 'Slight deviation from spec', crit: 'Critical failure detected' },
    'smartRead': { pass: 'Healthy', warn: '12 Reallocated Sectors', crit: 'Failing: 2058 Bad Sectors' },
    'ramStress': { pass: 'All tests passed', warn: '1 single-bit error found', crit: 'Multiple errors at address 0xDEADBEEF' },
    'cpuStress': { pass: 'Stable at 75°C under load', warn: 'Minor thermal throttling at 95°C', crit: 'Overheated and throttled to 40%' },
    'psuLoad': { pass: 'Voltage stable within 2% tolerance', warn: '12V rail dropped to 11.5V under load', crit: '5V rail fluctuated by 15%, causing instability' }
};

const runTest = async (test: DiagnosticTest): Promise<{ status: TestStatus, details: string, rawData?: string }> => {
  // ===================================================================================
  // HOOK FOR BOOTABLE ISO/ELECTRON IMPLEMENTATION
  // ===================================================================================
  // This function would execute native command-line tools. The simulation logic
  // below serves as a placeholder for the real implementation.
  //
  // Example for a POST Code Reader (usually a USB Serial device):
  //
  // const { SerialPort } = require('serialport');
  // const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
  //
  // return new Promise(resolve => {
  //   const timeout = setTimeout(() => {
  //       port.close();
  //       resolve({ status: TestStatus.Critical, details: 'No POST code received. System may not be powering on.' });
  //   }, 5000); // 5 second timeout
  //
  //   port.on('data', function (data) {
  //     clearTimeout(timeout);
  //     const postCode = data.toString('hex').toUpperCase();
  //     // Logic to interpret postCode...
  //     const interpretation = getMeaningOfPostCode(postCode); // A lookup function
  //     resolve({
  //        status: interpretation.status,
  //        details: `Code 0x${postCode}: ${interpretation.message}`,
  //        rawData: `0x${postCode}`
  //     });
  //     port.close();
  //   });
  // });
  // ===================================================================================

  // Special handling for Boot Status Check (POST) simulation
  if (test.id === 'postCheck') {
    return new Promise(resolve => {
        setTimeout(() => {
            const outcomes = [
                { status: TestStatus.Pass, msg: 'POST successful.' },
                { status: TestStatus.Critical, msg: 'POST failed: No video output.', code: '2A' },
                { status: TestStatus.Critical, msg: 'POST failed: Memory not detected.', code: 'C1' },
                { status: TestStatus.Warning, msg: 'POST completed with non-fatal errors.' },
            ];
            const result = outcomes[Math.floor(Math.random() * outcomes.length)];
            resolve({
                status: result.status,
                details: result.code ? `Last code 0x${result.code}. ${result.msg}` : result.msg,
                rawData: result.code ? `0x${result.code}` : undefined
            });
        }, test.duration);
    });
  }

  // Special handling for POST code capture simulation
  if (test.id === 'postCodeCapture') {
    return new Promise(resolve => {
        setTimeout(() => {
            const codes = [
                { code: 'FF', status: TestStatus.Pass, msg: 'Normal boot sequence completed.' },
                { code: '2A', status: TestStatus.Pass, msg: 'Initializing video interface.' },
                { code: 'D1', status: TestStatus.Critical, msg: 'DRAM initialization error. Check memory modules.' },
                { code: 'C1', status: TestStatus.Critical, msg: 'Memory detection error. Reseat RAM.' },
                { code: '55', status: TestStatus.Warning, msg: 'USB initialization stalled. Check USB devices.' },
                { code: '75', status: TestStatus.Warning, msg: 'HDD controller initialization failed. Check drives.' },
            ];
            const result = codes[Math.floor(Math.random() * codes.length)];
            resolve({
                status: result.status,
                details: `Code 0x${result.code}: ${result.msg}`,
                rawData: `0x${result.code}`
            });
        }, test.duration);
    });
  }
  
  console.log(`Simulating execution for: ${test.name}`);

  return new Promise(resolve => {
      setTimeout(() => {
          const rand = Math.random();
          let status: TestStatus;
          let detailsKey: 'pass' | 'warn' | 'crit';
          if (rand < 0.8) {
              status = TestStatus.Pass;
              detailsKey = 'pass';
          } else if (rand < 0.95) {
              status = TestStatus.Warning;
              detailsKey = 'warn';
          } else {
              status = TestStatus.Critical;
              detailsKey = 'crit';
          }
          
          const detailsSource = mockResultDetails[test.id] || mockResultDetails['default'];
          const details = detailsSource[detailsKey];
          
          resolve({ status, details });
      }, test.duration);
  });
};


const ScanningScreen: React.FC<ScanningScreenProps> = ({ scanMode, onScanComplete, onCancel }) => {
  const testsToRun = useMemo(() => SCAN_MODES_TESTS[scanMode], [scanMode]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Initializing scan...');
  
  useEffect(() => {
    const initialResults: TestResult[] = testsToRun.map(test => ({
      test,
      status: TestStatus.Pending,
      details: '',
    }));
    setResults(initialResults);

    let isCancelled = false;

    const executeScan = async () => {
      const finalResults = [...initialResults];

      for (let i = 0; i < testsToRun.length; i++) {
        if (isCancelled) return;
        
        const currentTest = testsToRun[i];
        
        // Update UI to show the current test is running
        setCurrentTestIndex(i);
        setCurrentMessage(`Running: ${currentTest.name}...`);
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: TestStatus.Running } : r));
        
        // Execute the actual test
        const result = await runTest(currentTest);
        if (isCancelled) return;

        // Update the final results array and the UI state with the outcome
        finalResults[i] = { test: currentTest, status: result.status, details: result.details, rawData: result.rawData };
        setResults([...finalResults]);
      }

      if (!isCancelled) {
        setCurrentMessage('Scan complete. Generating report...');
        setTimeout(() => onScanComplete(finalResults), 2000);
      }
    };

    executeScan();

    // Cleanup function to stop the scan if the component unmounts or cancel is clicked
    return () => {
      isCancelled = true;
    };
  }, [testsToRun, onScanComplete]);

  const progress = (currentTestIndex / testsToRun.length) * 100;
  
  return (
    <div className="bg-brand-gray-dark border border-brand-gray-light rounded-lg p-8 w-full no-print">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Running <span className="text-brand-blue">{scanMode}</span></h2>
        <button onClick={onCancel} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Cancel Scan</button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-gray-300">{currentMessage}</span>
          <span className="text-sm font-medium text-gray-300">{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="w-full bg-brand-gray-medium rounded-full h-2.5">
          <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      </div>
      
      <div className="bg-brand-dark p-4 rounded-lg h-[60vh] overflow-y-auto font-mono text-sm">
        {results.map(({ test, status, details }, index) => {
          const Icon = componentIcons[test.component];
          return (
            <div key={index} className={`flex items-center p-2 rounded ${status === TestStatus.Running ? 'bg-blue-900/50' : ''}`}>
              <div className="w-8">{statusIcons[status]}</div>
              <div className="w-8 mr-2"><Icon className="w-5 h-5 text-gray-400" /></div>
              <div className="flex-1 text-gray-300">{test.name}</div>
              <div className="flex-1 text-gray-500">{details}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScanningScreen;