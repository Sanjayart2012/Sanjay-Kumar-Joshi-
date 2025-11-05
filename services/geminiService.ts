import { GoogleGenAI } from "@google/genai";
import { TestResult } from '../types';
import { generateOfflineReport } from './offlineReportService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface ReportSummary {
  summary: string;
  source: 'AI' | 'Offline';
}

export const generateReportSummary = async (results: TestResult[]): Promise<ReportSummary> => {
  const failedTests = results.filter(r => r.status === 'Warning' || r.status === 'Critical');
  if (failedTests.length === 0) {
    return {
      summary: "All systems are functioning optimally. No issues were detected during the scan. The PC is in excellent health.",
      source: 'Offline'
    };
  }

  const prompt = `
    You are an AI PC Health Doctor running on a diagnostic kiosk in a computer repair shop.
    Your task is to analyze the following JSON data from a hardware and software scan and generate a report for the customer.
    The report should be in plain, easy-to-understand language (you can use English).
    
    Instructions:
    1.  Start with a one-line health summary (e.g., "The PC has some critical issues that need attention.").
    2.  For each test that has a 'Warning' or 'Critical' status, explain what the test was, what the result means in simple terms, and what the potential consequences are.
    3.  Based on the combination of failing tests, provide a ranked list of probable root causes.
    4.  Recommend specific actions, categorizing them into "Software Fixes" (e.g., driver updates, OS repair) and "Hardware Fixes" (e.g., part replacement).
    5.  For hardware fixes, suggest the type of part that might be needed (e.g., "New DDR4 RAM module", "SATA SSD replacement", "Motherboard VRM repair").
    6.  Maintain a professional, helpful, and reassuring tone.
    
    Here is the diagnostic data:
    ${JSON.stringify(failedTests, null, 2)}
    
    Generate the report now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return { summary: response.text, source: 'AI' };
  } catch (error) {
    console.warn("AI service failed, falling back to offline report generator:", error);
    // In a bootable environment, internet might not be available.
    // This provides a more specific fallback message.
    const offlineSummary = generateOfflineReport(results);
    return { summary: offlineSummary, source: 'Offline' };
  }
};