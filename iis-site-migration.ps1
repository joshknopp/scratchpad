# Define variables
$domainName = "example.com"
$oldSiteName = "SiteA"
$newSiteName = "SiteB"
$certificateThumbprint = "1234567890abcdef"

# Get the IIS Manager module
Import-Module WebAdministration

# Get the current binding information for the domain name
$binding = Get-WebBinding -Name $oldSiteName -Protocol "https" | Where-Object {$_.bindingInformation -like "*:$domainName"}

# Get the certificate associated with the binding
$certificate = Get-Item -Path "Cert:\LocalMachine\My\$certificateThumbprint"

# Create a new binding for the new site with the same binding information
$bindingInformation = $binding.bindingInformation
$newBinding = New-WebBinding -Name $newSiteName -Protocol "https" -HostHeader $domainName -SslFlags 1 -CertificateThumbprint $certificate.Thumbprint -IPAddress "*" -Port $bindingInformation.Split(":")[-1]

# Remove the old binding from the old site
Remove-WebBinding -Name $oldSiteName -BindingInformation $bindingInformation

# Add the new binding to the new site
Add-WebBinding -Name $newSiteName -BindingInformation $newBinding.bindingInformation
