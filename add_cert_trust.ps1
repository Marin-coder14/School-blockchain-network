param(
    [string]$PfxPath = "$PSScriptRoot\certs\cert.pfx",
    [string]$Password = "qrcode-ssl-temp",
    [switch]$CurrentUser
)

if (-not (Test-Path $PfxPath)) {
    Write-Error "PFX file not found at $PfxPath"
    exit 1
}

$securePwd = ConvertTo-SecureString -String $Password -AsPlainText -Force
$store = if ($CurrentUser) { 'Cert:\CurrentUser\Root' } else { 'Cert:\LocalMachine\Root' }

Write-Host "Importing $PfxPath into $store"

try {
    Import-PfxCertificate -FilePath $PfxPath -CertStoreLocation $store -Password $securePwd | Out-Null
    Write-Host "Certificate imported into $store. You may need to restart your browser to trust it."
} catch {
    Write-Error "Failed to import certificate: $_"
    exit 2
}
