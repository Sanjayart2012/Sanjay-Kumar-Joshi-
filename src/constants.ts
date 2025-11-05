import { DiagnosticTest, ScanMode } from './types';

const allTests: { [key: string]: DiagnosticTest } = {
  // System
  sysId: { id: 'sysId', name: 'System Identification', component: 'System', duration: 1000, description: 'Model, S/N, BIOS, OS, CPU, GPU' },
  eventLog: { id: 'eventLog', name: 'Event Log Summary', component: 'System', duration: 1500, description: 'Last 24h critical OS errors' },
  diskSpace: { id: 'diskSpace', name: 'Disk Space Check', component: 'Storage', duration: 500, description: 'Free space & fragmentation' },
  malwareHeuristic: { id: 'malwareHeuristic', name: 'Malware Quick Heuristic', component: 'System', duration: 2500, description: 'Signature-less quick scan' },
  fsHealth: { id: 'fsHealth', name: 'File System Health', component: 'Storage', duration: 4000, description: 'chkdsk / fsck summary' },
  driverConflicts: { id: 'driverConflicts', name: 'Driver Conflict Detection', component: 'System', duration: 3000, description: 'Checks for outdated or conflicting drivers' },
  startupPrograms: { id: 'startupPrograms', name: 'Startup Program Analysis', component: 'System', duration: 2000, description: 'Analyzes startup programs & services' },
  firmwareIntegrity: { id: 'firmwareIntegrity', name: 'Firmware/BIOS Integrity', component: 'Motherboard', duration: 6000, description: 'Check version, signatures for vulnerabilities' },
  kernelDump: { id: 'kernelDump', name: 'Kernel Dump Analysis', component: 'System', duration: 7000, description: 'Analyze crash dumps if present' },
  deepMalware: { id: 'deepMalware', name: 'Deep Malware Scan', component: 'System', duration: 15000, description: 'Multi-engine signature + behavioral scan' },
  sfcDism: { id: 'sfcDism', name: 'System File Integrity', component: 'System', duration: 10000, description: 'SFC / DISM checks' },

  // CPU
  cpuTemp: { id: 'cpuTemp', name: 'CPU Temperature Snapshot', component: 'CPU', duration: 500, description: 'Idle temperature reading' },
  cpuLoadProfile: { id: 'cpuLoadProfile', name: 'CPU Usage Profiling', component: 'CPU', duration: 3500, description: 'Profiles background process usage' },
  cpuStress: { id: 'cpuStress', name: 'CPU Stress Test', component: 'CPU', duration: 12000, description: 'Long burn-in with temperature trace' },

  // GPU
  gpuTemp: { id: 'gpuTemp', name: 'GPU Temperature Snapshot', component: 'GPU', duration: 500, description: 'Idle temperature reading' },
  gpuStress: { id: 'gpuStress', name: 'GPU Stress Test', component: 'GPU', duration: 12000, description: 'Benchmark & artifact detection' },
  
  // Thermal (CPU/GPU)
  thermalProfile: { id: 'thermalProfile', name: 'Thermal Profile (Short Load)', component: 'CPU', duration: 5000, description: '30-60s synthetic load to test cooling' },
  thermalImaging: { id: 'thermalImaging', name: 'Thermal Imaging Scan', component: 'Motherboard', duration: 8000, description: 'Scan for VRM/MOSFET hotspots' },

  // Storage
  smartRead: { id: 'smartRead', name: 'SMART Quick Read', component: 'Storage', duration: 1000, description: 'Health %, temp, reallocated sectors' },
  smartExtended: { id: 'smartExtended', name: 'SMART Extended Attributes', component: 'Storage', duration: 4000, description: 'Full SMART logs and vendor attributes' },
  nvmeSelfTest: { id: 'nvmeSelfTest', name: 'NVMe SMART Self-Test', component: 'Storage', duration: 6000, description: 'Trigger short/long self-test' },
  diskSurface: { id: 'diskSurface', name: 'Disk Surface Scan', component: 'Storage', duration: 20000, description: 'Full read-only scan for bad blocks' },

  // RAM
  ramQuick: { id: 'ramQuick', name: 'RAM Quick Test', component: 'RAM', duration: 4500, description: 'Light pattern tests for obvious errors' },
  ramStress: { id: 'ramStress', name: 'RAM Stress Test (memtest86)', component: 'RAM', duration: 18000, description: 'Detect single-bit errors & stability' },

  // Battery
  batteryStatus: { id: 'batteryStatus', name: 'Battery Status Check', component: 'Battery', duration: 1000, description: 'Cycle count, design vs current capacity' },

  // PSU
  psuIdle: { id: 'psuIdle', name: 'PSU Voltage Snapshot (Idle)', component: 'PSU', duration: 2000, description: 'Check idle voltage rails' },
  psuLoad: { id: 'psuLoad', name: 'PSU Under-Load Test', component: 'PSU', duration: 9000, description: 'Check voltage stability across rails' },

  // Network
  networkHealth: { id: 'networkHealth', name: 'Network Health Check', component: 'Network', duration: 3000, description: 'Latency & packet loss to local target' },
  
  // Motherboard
  postCheck: { id: 'postCheck', name: 'Boot Status Check (POST)', component: 'Motherboard', duration: 1000, description: 'Fast POST observation' },
  postCodeCapture: { id: 'postCodeCapture', name: 'POST Code Capture & Analysis', component: 'Motherboard', duration: 5000, description: 'Capture POST codes via reader' },
  eventCorrelation: { id: 'eventCorrelation', name: 'OS Event Correlation', component: 'Motherboard', duration: 4000, description: 'Correlate PCI/ACPI errors with thermal events' },
  peripheralDetection: { id: 'peripheralDetection', name: 'Peripheral Detection Failures', component: 'Motherboard', duration: 6000, description: 'Test USB/SATA/Ethernet for drops' },
  sensorAnomalies: { id: 'sensorAnomalies', name: 'Sensor Anomaly Detection', component: 'Motherboard', duration: 5000, description: 'Compare EC sensor data with external readings' },
  chipLevelCheck: { id: 'chipLevelCheck', name: 'Chip-Level Fault Signature Check', component: 'Motherboard', duration: 7000, description: 'Check for missing SMBus/I2C responses' },
};

// Fix: Define test lists as separate constants to allow for correct composition and avoid spreading non-iterable objects.
const quickScanTests: DiagnosticTest[] = [
  allTests.sysId,
  allTests.smartRead,
  allTests.postCheck,
  allTests.eventLog,
  allTests.cpuTemp,
  allTests.gpuTemp,
  allTests.diskSpace,
  allTests.malwareHeuristic,
  allTests.batteryStatus,
];

const fullScanTests: DiagnosticTest[] = [
  ...quickScanTests,
  allTests.smartExtended,
  allTests.nvmeSelfTest,
  allTests.fsHealth,
  allTests.driverConflicts,
  allTests.startupPrograms,
  allTests.cpuLoadProfile,
  allTests.thermalProfile,
  allTests.ramQuick,
  allTests.psuIdle,
  allTests.networkHealth,
].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // Unique tests

const deepScanTests: DiagnosticTest[] = [
  ...fullScanTests,
  allTests.ramStress,
  allTests.diskSurface,
  allTests.psuLoad,
  allTests.gpuStress,
  allTests.cpuStress,
  allTests.thermalImaging,
  allTests.firmwareIntegrity,
  allTests.kernelDump,
  allTests.deepMalware,
  allTests.sfcDism,
].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

const motherboardScanTests: DiagnosticTest[] = [
  allTests.sysId,
  allTests.postCodeCapture,
  allTests.eventCorrelation,
  allTests.psuLoad,
  allTests.thermalImaging,
  allTests.peripheralDetection,
  allTests.sensorAnomalies,
  allTests.chipLevelCheck,
  allTests.firmwareIntegrity,
];

export const SCAN_MODES_TESTS: { [key in ScanMode]: DiagnosticTest[] } = {
  [ScanMode.Quick]: quickScanTests,
  [ScanMode.Full]: fullScanTests,
  [ScanMode.Deep]: deepScanTests,
  [ScanMode.Motherboard]: motherboardScanTests,
};
