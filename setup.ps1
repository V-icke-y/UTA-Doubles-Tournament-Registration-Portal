# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    } catch {
        return $false
    } finally {
        $ErrorActionPreference = $oldPreference
    }
}

# Check for required tools
Write-Host "Checking for required tools..."

if (-not (Test-CommandExists "node")) {
    Write-Host "Node.js is not installed. Please install Node.js first."
    exit 1
}

if (-not (Test-CommandExists "npm")) {
    Write-Host "npm is not installed. Please install npm first."
    exit 1
}

if (-not (Test-CommandExists "mysql")) {
    Write-Host "MySQL is not installed. Please install MySQL first."
    exit 1
}

# Install backend dependencies
Write-Host "Installing backend dependencies..."
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "Installing frontend dependencies..."
Set-Location frontend
npm install
Set-Location ..

# Create database and tables
Write-Host "Setting up database..."
$mysqlPath = "mysql"
$dbScript = Get-Content "backend/database.sql" -Raw

try {
    $process = Start-Process $mysqlPath -ArgumentList "-u root" -NoNewWindow -PassThru -Wait
    if ($process.ExitCode -ne 0) {
        Write-Host "Error setting up database. Please make sure MySQL is running and the root user has no password."
        exit 1
    }
} catch {
    Write-Host "Error setting up database: $_"
    exit 1
}

Write-Host "Setup completed successfully!"
Write-Host "You can now run the application using: .\start.ps1" 