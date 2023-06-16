# Prompt for the input string
$inputString = Read-Host "Enter the input string in the format 'Doe, John <John.Doe@domain.com>; Smith, Jane <Jane.Smith@domain.com>'"

# Extract email addresses
$emailAddresses = [regex]::Matches($inputString, "\<(.*?)\>") | ForEach-Object { $_.Groups[1].Value }

# Prompt for the output type
$outputType = Read-Host "Select the desired output type:`n1) Comma-delimited list`n2) One address per line"

# Output the email addresses based on the selected output type
switch ($outputType) {
    "1" {
        $commaDelimitedList = $emailAddresses -join ","
        Write-Host "Email Addresses (Comma-delimited list): $commaDelimitedList"
    }
    "2" {
        Write-Host "Email Addresses (One address per line):"
        $emailAddresses | ForEach-Object { Write-Host $_ }
    }
    default {
        Write-Host "Invalid output type selected. Exiting..."
    }
}
