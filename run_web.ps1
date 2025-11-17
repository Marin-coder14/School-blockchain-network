$venvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-Not (Test-Path $venvPython)) {
    Write-Host "Workspace venv python not found at $venvPython; falling back to system python."
    $venvPython = "python"
}

& $venvPython "$PSScriptRoot\web_app.py"
