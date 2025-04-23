# Get the current directory
$currentDir = Get-Location

# Start backend server
Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentDir\backend'; npm run dev"

# Wait a moment for the backend to start
Start-Sleep -Seconds 5

# Start frontend server
Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentDir\frontend'; npm start"

Write-Host "Both servers are starting up..."
Write-Host "Backend will be available at: http://localhost:5000"
Write-Host "Frontend will be available at: http://localhost:3000" 