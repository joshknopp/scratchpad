# Define the source path, destination path, and paths to copy
$sourcePath = "C:\Source"
$destinationPath = "C:\Destination"
$pathsToCopy = @"
Folder1
Folder2
Folder3
"@

# Split the $pathsToCopy variable into an array of relative paths
$relativePaths = $pathsToCopy -split "`r`n"

# Iterate over the relative paths and copy contents to the destination
foreach ($relativePath in $relativePaths) {
    # Construct the full source and destination paths
    $fullSourcePath = Join-Path -Path $sourcePath -ChildPath $relativePath
    $fullDestinationPath = Join-Path -Path $destinationPath -ChildPath $relativePath

    # Create the destination folder if it doesn't exist
    if (-not (Test-Path -Path $fullDestinationPath -PathType Container)) {
        New-Item -Path $fullDestinationPath -ItemType Directory -Force
    }

    # Copy the contents from source to destination
    Copy-Item -Path $fullSourcePath -Destination $fullDestinationPath -Recurse -Force
}

Write-Host "Copy completed."
