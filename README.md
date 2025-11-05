# PC Health Doctor - Windows Application

This document outlines the architecture and steps required to package the PC Health Doctor React application into a standalone Windows installer (`.exe`). This allows the tool to be easily installed and run on any Windows 10 or 11 machine.

## 1. High-Level Architecture

The application consists of two primary layers:

1.  **UI Layer (React + Vite):** This is the web application that provides the user interface. It is built and bundled into optimized static files (HTML, CSS, JS) by the Vite build tool.
2.  **Application Wrapper (Electron):** Electron is used to package the React app into a native desktop application. It creates a desktop window and loads the UI, providing a bridge (via Node.js) to the underlying Windows operating system. This bridge is essential for running native diagnostic commands.

## 2. How to Run Real Diagnostic Checks

The key to making this a real tool is the `runTest` function within `src/components/ScanningScreen.tsx`. Currently, it simulates test results. To make it functional, you would replace the simulation logic with calls to native Windows command-line tools using Node.js's `child_process` module.

### Example: Implementing a Real SMART Check on Windows

The `runTest` function could be modified as follows to execute `wmic`, a standard tool for querying system information:

```javascript
// This code would live inside ScanningScreen.tsx
// You would need to set up IPC (Inter-Process Communication) to call Node.js
// modules from the renderer process securely in a real Electron app.
// For simplicity, this example shows the core logic.

const runTest = async (test) => {
  if (test.id === 'smartRead') {
    return new Promise(resolve => {
      // Execute the native wmic command.
      const { exec } = require('child_process');
      exec('wmic diskdrive get status', (error, stdout, stderr) => {
        if (error || stderr) {
          resolve({ status: 'Critical', details: 'Could not execute WMIC.' });
          return;
        }

        // WMIC returns "OK" for each drive on a new line.
        if (stdout.includes('OK')) {
          resolve({ status: 'Pass', details: 'SMART status OK.' });
        } else {
          resolve({ status: 'Critical', details: 'SMART check FAILED.' });
        }
      });
    });
  }
  // ... handle other tests like chkdsk, powershell Get-WinEvent, etc.
};
```

## 3. Creating a Windows Installer (.exe)

This project is configured to create a professional Windows installer with a single command.

### 3.1 Prerequisites

-   [Node.js and npm](https://nodejs.org/) installed on your machine.

### 3.2 Installation

1.  Open a terminal or command prompt in the project root directory.
2.  Install all the required dependencies:
    ```bash
    npm install
    ```

### 3.3 Building the Installer

1.  From the project root, run the distribution script:
    ```bash
    npm run dist
    ```
2.  This command will first build the React application using Vite, then package everything into a Windows installer using `electron-builder`.

3.  When the process is complete, you will find the installer in the `dist/` directory. The file will be named something like `PC-Health-Doctor-Setup-1.0.0.exe`.

You can now distribute this `.exe` file to install the application on any Windows 10 or 11 computer.