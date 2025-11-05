import { TestResult, TestStatus } from '../types';

interface Rule {
  status: TestStatus;
  issue: string;
  consequence: string;
  softwareFix?: string;
  hardwareFix?: string;
}

const knowledgeBase: { [testId: string]: Rule } = {
  // Storage
  smartRead: {
    status: TestStatus.Critical,
    issue: "The storage drive's SMART health check is reporting critical failure.",
    consequence: "This indicates imminent drive failure, which can lead to complete data loss.",
    hardwareFix: "Immediately back up all important data. The storage drive (HDD/SSD) must be replaced."
  },
  diskSurface: {
    status: TestStatus.Critical,
    issue: "The disk surface scan found a significant number of bad blocks.",
    consequence: "Data stored in these areas may be corrupt and unreadable. The drive's condition will likely worsen.",
    hardwareFix: "The storage drive is physically damaged and needs to be replaced. Attempt data recovery if necessary before replacement."
  },
  fsHealth: {
      status: TestStatus.Critical,
      issue: "The file system health check (chkdsk/fsck) found major errors.",
      consequence: "This can cause system instability, crashes, and prevent the OS from booting.",
      softwareFix: "Run a full file system repair (e.g., 'chkdsk /f' on Windows). If errors persist, the underlying drive may be failing.",
  },
  // RAM
  ramStress: {
    status: TestStatus.Critical,
    issue: "The memory stress test detected multiple, repeatable errors.",
    consequence: "Faulty RAM is a primary cause of random system crashes (Blue Screens), data corruption, and unpredictable behavior.",
    hardwareFix: "The failing RAM module(s) need to be identified and replaced."
  },
  // CPU / Thermal
  cpuStress: {
    status: TestStatus.Critical,
    issue: "The CPU overheated and severely throttled its performance under load.",
    consequence: "This will cause the system to be very slow during intensive tasks and can lead to permanent CPU damage over time.",
    hardwareFix: "Check the CPU cooling system. The thermal paste may need to be reapplied, the heatsink cleaned, or the fan replaced."
  },
  thermalImaging: {
      status: TestStatus.Critical,
      issue: "Thermal imaging detected a hotspot on the motherboard's VRM or MOSFETs.",
      consequence: "This indicates a failing power delivery component on the motherboard, which can lead to instability and component failure.",
      hardwareFix: "This is a board-level fault that requires advanced repair or motherboard replacement."
  },
  // PSU
  psuLoad: {
    status: TestStatus.Critical,
    issue: "The Power Supply Unit (PSU) showed significant voltage drops or fluctuations under load.",
    consequence: "An unstable PSU can cause random shutdowns, component damage, and boot failures.",
    hardwareFix: "The PSU is failing and must be replaced with a quality unit of appropriate wattage."
  },
  // Motherboard
  postCodeCapture: {
      status: TestStatus.Critical,
      issue: "The system failed to boot, halting at a specific POST (Power-On Self-Test) code.",
      consequence: "This indicates a fundamental hardware failure preventing the computer from starting. The code points to the specific component that is failing.",
      hardwareFix: "Look up the captured POST code in the motherboard's official manual. Common causes include faulty RAM (codes C1-C6, D1-D5), GPU issues (codes 2A-31), or CPU problems. The specific code is the key to diagnosis."
  },
  // Default for other warnings/criticals
  defaultWarning: {
      status: TestStatus.Warning,
      issue: "A component is operating outside of its ideal parameters.",
      consequence: "While not critical, this could lead to performance degradation or future failures.",
      softwareFix: "Check for updated drivers or software settings related to the component.",
      hardwareFix: "Monitor the component's health. If the issue persists, consider replacement."
  },
  defaultCritical: {
      status: TestStatus.Critical,
      issue: "A critical error was detected in a key component.",
      consequence: "This is likely causing system instability, crashes, or data loss.",
      hardwareFix: "The component requires immediate attention and likely needs to be replaced."
  }
};

export const generateOfflineReport = (results: TestResult[]): string => {
  const failedTests = results.filter(r => r.status === 'Warning' || r.status === 'Critical');

  if (failedTests.length === 0) {
    return "All systems passed. No issues found.";
  }

  let summary = "The PC has some issues that require attention. Here is a summary of the findings:\n\n";

  const softwareFixes: string[] = [];
  const hardwareFixes: string[] = [];

  failedTests.forEach(result => {
    const testId = result.test.id;
    let rule = knowledgeBase[testId];
    
    if (!rule || (rule.status !== result.status && testId !== 'postCodeCapture')) {
        rule = result.status === TestStatus.Warning ? knowledgeBase.defaultWarning : knowledgeBase.defaultCritical;
    }

    summary += `### Test Failed: ${result.test.name} (${result.status}) ###\n`;
    summary += `- **Issue:** ${rule.issue}\n`;
    summary += `- **Details:** ${result.details}\n`;
    summary += `- **Consequence:** ${rule.consequence}\n\n`;

    if (rule.softwareFix) softwareFixes.push(rule.softwareFix);
    if (rule.hardwareFix) hardwareFixes.push(rule.hardwareFix);
  });
  
  summary += "---RECOMMENDED ACTIONS---\n";

  if (hardwareFixes.length > 0) {
      summary += "\n**Hardware Fixes (High Priority):**\n";
      // Deduplicate fixes before listing
      [...new Set(hardwareFixes)].forEach(fix => summary += `- ${fix}\n`);
  }
  
  if (softwareFixes.length > 0) {
      summary += "\n**Software Fixes:**\n";
      [...new Set(softwareFixes)].forEach(fix => summary += `- ${fix}\n`);
  }

  if (hardwareFixes.length === 0 && softwareFixes.length === 0) {
      summary += "No specific automatic recommendations available. Please consult a technician for manual diagnosis based on the detailed results."
  }

  return summary;
};