# Define the endpoint URL
$endpoint = "http://example.com/api/data?key="

# Define the API key
$apiKey = "your_api_key_here"

# Define the list of keys
$keys = @(1, 2, 3)

# Loop through the list of keys
foreach ($key in $keys) {

    # Use the WebClient class to make the request
    $client = New-Object System.Net.WebClient
    $client.Headers.Add("Authorization", "Bearer $apiKey")
    $jsonContent = $client.DownloadString($endpoint + $key)

    # Use ConvertFrom-Json to deserialize the JSON content
    $data = $jsonContent | ConvertFrom-Json

    # Flatten the data set and add the key as a column
    $flattenedData = @()
    foreach ($item in $data) {
        $item | Add-Member -NotePropertyName "key" -NotePropertyValue $key
        $flattenedData += ($item | Select-Object -ExpandProperty * | Select-Object -Property *)
    }

    # Insert the flattened data into the SQL server table
    $connectionString = "Data Source=.\SQLEXPRESS;Initial Catalog=TestDB;Integrated Security=True"
    $bulkCopy = New-Object System.Data.SqlClient.SqlBulkCopy($connectionString)
    $bulkCopy.DestinationTableName = "TestTable"
    $bulkCopy.WriteToServer($flattenedData)

    # Log the result
    Write-Output "Data for key $key inserted successfully."
}
