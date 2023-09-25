# Define the folder to start the search from
$folderToSearch = "C:\Path\To\Your\Folder"

# Define the target filename
$targetFileName = "model.sql"

# Define the substring to search for within the file content
$substringToMatch = "your_substring_here"

# Recursively search for files with the specified filename in the specified folder and its subfolders
Get-ChildItem -Path $folderToSearch -Recurse -Filter $targetFileName | ForEach-Object {
    $filePath = $_.FullName
    $fileContent = Get-Content -Path $filePath -Raw

    # Check if the file content contains the specified substring
    if ($fileContent -like "*$substringToMatch*") {
        Write-Host "Matching file found: $filePath"
    }
}
