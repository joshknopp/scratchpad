# Create a Word application object
$wordApp = New-Object -ComObject Word.Application

# Define the input Word document and the output PDF file
$wordDocumentPath = "C:\path\to\your\input.docx"
$pdfFilePath = "C:\path\to\output.pdf"

# Open the Word document
$document = $wordApp.Documents.Open($wordDocumentPath)

# Save the document as PDF
$document.SaveAs([ref]$pdfFilePath, [ref]17) # 17 is the value for PDF format

# Close the Word document
$document.Close()

# Quit the Word application
$wordApp.Quit()

# Release the COM objects
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($document) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($wordApp) | Out-Null
Remove-Variable wordApp

Write-Host "Word document converted to PDF: $pdfFilePath"
