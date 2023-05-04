# Get the path to the Word document
$docPath = "C:\path\to\document.docx"

# Create a new instance of Word and open the document in read-only mode
$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open($docPath, $false, $true)

# Convert the document to HTML and remove the <head> and <body> tags
$html = $doc.Content.EnhancedMarkup
$html = $html.Replace("<head>", "").Replace("</head>", "").Replace("<body>", "").Replace("</body>", "")

# Convert the HTML to Markdown
$markdown = ""
$regex = [regex]::new("<p.*?>(.*?)<\/p>")
$matches = $regex.Matches($html)
foreach ($match in $matches) {
    $paragraph = $match.Groups[1].Value
    $paragraph = $paragraph -replace "<(\/)*strong>", "**" # Replace <strong> tags with Markdown bold
    $paragraph = $paragraph -replace "<(\/)*em>", "*" # Replace <em> tags with Markdown italic
    $paragraph = $paragraph -replace "<(\/)*u>", "<u>" # Replace <u> tags with Markdown underline
    $paragraph = $paragraph -replace "<(\/)*strike>", "<del>" # Replace <strike> tags with Markdown strikethrough
    $paragraph = $paragraph -replace "<(\/)*a>", "" # Remove <a> tags
    $paragraph = $paragraph -replace "`r`n", "`n" # Remove any Windows line breaks
    $markdown += $paragraph + "`n`n"
}

# Clean up the Markdown formatting
$markdown = $markdown -replace "^(\s*)<li>", "`$1* " # Replace <li> tags with Markdown bullet points
$markdown = $markdown -replace "<(\/)*table.*?>", "|_. " # Replace <table> tags with Markdown tables
$markdown = $markdown -replace "<(\/)*tr.*?>", "|" # Replace <tr> tags with Markdown table rows
$markdown = $markdown -replace "<(\/)*td.*?>", "|" # Replace <td> tags with Markdown table cells
$markdown = $markdown -replace "`n`n`n+", "`n`n" # Remove excess line breaks

# Close the document and quit Word
$doc.Close()
$word.Quit()

# Output the Markdown
Write-Output $markdown
