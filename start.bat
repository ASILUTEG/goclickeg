@echo off
title GoClick - Starting Servers...
color 0A

echo.
echo  ============================================
echo    GoClick Dev Servers
echo  ============================================
echo.

:: Kill anything on port 3001 or 8080 first
echo  Clearing old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 "') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 "') do taskkill /f /pid %%a 2>nul
timeout /t 1 /nobreak >nul

:: Start Node API server (port 3001)
echo  Starting API server on port 3001...
start "GoClick API" cmd /k "node server.js"

:: Wait 2 seconds for Node to be ready
timeout /t 2 /nobreak >nul

:: Start Vite frontend (port 8080)
echo  Starting frontend on port 8080...
start "GoClick Frontend" cmd /k "npm run dev"

:: Wait 3 seconds then open browser
timeout /t 3 /nobreak >nul
echo.
echo  ============================================
echo    Opening http://127.0.0.1:8080
echo  ============================================
start http://127.0.0.1:8080

echo.
echo   Both servers are running!
echo   API:      http://localhost:3001
echo   Frontend: http://127.0.0.1:8080
echo   Admin:    http://127.0.0.1:8080/admin
echo.
echo   Login: admin / admin123
echo.
pause
