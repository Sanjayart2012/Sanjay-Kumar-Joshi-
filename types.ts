
export enum ScanMode {
  Quick = 'Quick Scan',
  Full = 'Full Scan',
  Deep = 'Deep/Forensic Scan',
  Motherboard = 'Motherboard Diagnostic',
}

export enum TestStatus {
  Pending = 'Pending',
  Running = 'Running',
  Pass = 'Pass',
  Warning = 'Warning',
  Critical = 'Critical',
}

export interface DiagnosticTest {
  id: string;
  name: string;
  component: 'CPU' | 'RAM' | 'Storage' | 'GPU' | 'Motherboard' | 'Battery' | 'Network' | 'PSU' | 'System';
  duration: number; // in milliseconds
  description: string;
}

export interface TestResult {
  test: DiagnosticTest;
  status: TestStatus;
  details: string;
  rawData?: string;
}

export type Screen = 'home' | 'scanning' | 'report';