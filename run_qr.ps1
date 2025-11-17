param(
    [string]$Text = "Hello from PowerShell",
    [string]$Output = "$PSScriptRoot\sample_qr.png"
)

$venvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-Not (Test-Path $venvPython)) {
    Write-Host "Workspace venv python not found at $venvPython; falling back to system python."
    $venvPython = "python"
}

# Ensure arguments are quoted properly
& $venvPython "$PSScriptRoot\generate_qr.py" $Text -o $Output
Write-Host "Generated QR at: $Output"