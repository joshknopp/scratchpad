# Load the stored credentials from the file
$securePassword = Get-Content "C:\path\to\credential.txt" | ConvertTo-SecureString

# Convert secure password to plain text for sending mail (not recommended, but here's how)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Replace the values with your own email settings
$EmailFrom = "your_email@example.com"
$EmailTo = "recipient@example.com"
$Subject = "Test Email"
$Body = "This is a test email."

# Create a credential object
$credentials = New-Object System.Management.Automation.PSCredential -ArgumentList $EmailFrom, $securePassword

# Set up the email parameters
$SMTPServer = "smtp.example.com"
$SMTPPort = 587

# Send the email
Send-MailMessage -From $EmailFrom -To $EmailTo -Subject $Subject -Body $Body -SmtpServer $SMTPServer -Port $SMTPPort -UseSsl -Credential $credentials
