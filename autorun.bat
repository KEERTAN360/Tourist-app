@echo off
echo ========================================
echo     Auto Setup and Run Script
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo Node.js is installed: 
node --version
echo.

REM Check if Python is installed
echo [2/6] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org/
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo Python is installed: 
python --version
echo.

REM Install Node.js dependencies
echo [3/6] Installing Node.js dependencies...
if not exist "node_modules" (
    echo Installing npm packages (this may take a few minutes)...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install npm packages!
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
) else (
    echo Node modules already installed. Checking for updates...
    call npm install
)
echo.

REM Install Python dependencies
echo [4/6] Installing Python dependencies...
cd blockchain_temp
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python packages...
pip install flask flask-cors requests numpy >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python packages!
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
cd ..
echo.

REM Start the blockchain server
echo [5/6] Starting Blockchain Server...
cd blockchain_temp
start "Blockchain Server" cmd /k "venv\Scripts\activate.bat && python peer.py"
cd ..
echo Blockchain server started on http://localhost:5000
echo.

REM Wait a moment for blockchain to start
timeout /t 3 /nobreak >nul

REM Start the Next.js development server
echo [6/6] Starting Next.js Development Server...
start "Next.js Server" cmd /k "npm run dev"
echo Next.js server starting on http://localhost:3000
echo.

echo ========================================
echo     Application Started Successfully!
echo ========================================
echo.
echo Blockchain API: http://localhost:5000
echo Web Application: http://localhost:3000
echo.
echo Two terminal windows have been opened:
echo   1. Blockchain Server (Python)
echo   2. Next.js Server (Node.js)
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo Application is running!
echo Close the terminal windows to stop the servers.
echo.
