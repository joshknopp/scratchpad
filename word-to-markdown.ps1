# Get the path to the Word document
$docPath = "C:\path\to\document.docx"

# Create a new instance of Word and open the document in read-only mode
$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open($docPath, $false, $true)

# Convert the document to HTML and remove the <head> and <body> tags
$html = $doc.Content.WordOpenXML
$html = $html -replace "</?strong>", "**" # Replace <strong> tags with Markdown bold
$html = $html -replace "</?em>", "*" # Replace <em> tags with Markdown italic
$html = $html -replace "</?u>", "<u>" # Replace <u> tags with Markdown underline
$html = $html -replace "</?strike>", "<del>" # Replace <strike> tags with Markdown strikethrough
$html = $html -replace "<a.*?>|</a>", "" # Remove <a> tags
$html = $html -replace "<br>", "`r`n" # Replace <br> tags with Windows line breaks
$html = $html -replace "<p.*?>", "" # Remove <p> tags
$html = $html -replace "</p>", "`r`n`r`n" # Replace </p> tags with two line breaks

# Convert the HTML to Markdown
$markdown = $html

# Clean up the Markdown formatting
$markdown = $markdown -replace "^(\s*)<li>", "`$1* " # Replace <li> tags with Markdown bullet points
$markdown = $markdown -replace "<table.*?>", "" # Remove <table> tags
$markdown = $markdown -replace "<tr.*?>", "" # Remove <tr> tags
$markdown = $markdown -replace "<td.*?>", "|" # Replace <td> tags with Markdown table cells
$markdown = $markdown -replace "`r`n`r`n`r`n+", "`r`n`r`n" # Remove excess line breaks

# Close the document and quit Word
$doc.Close()
$word.Quit()

# Output the Markdown
Write-Output $markdown
