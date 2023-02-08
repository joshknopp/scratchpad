# Import the required modules
Import-Module -Name 'System.Net.Http'
Import-Module -Name 'Newtonsoft.Json'

# Define the endpoint URL
$endpoint = "http://example.com/api/data"

# Use the HttpClient class to make the request
$client = New-Object System.Net.Http.HttpClient
$response = $client.GetAsync($endpoint).Result

# Check if the response was successful
if ($response.IsSuccessStatusCode) {

    # Get the JSON content from the response
    $jsonContent = $response.Content.ReadAsStringAsync().Result

    # Use Newtonsoft.Json to deserialize the JSON content
    $data = [Newtonsoft.Json.JsonConvert]::DeserializeObject<PSObject>($jsonContent)

    # Flatten the data set
    $flattenedData = @()
    foreach ($item in $data) {
        $flattenedData += ($item | Select-Object -ExpandProperty * | Select-Object -Property *)
    }

    # Insert the flattened data into the SQL server table
    $connectionString = "Data Source=.\SQLEXPRESS;Initial Catalog=TestDB;Integrated Security=True"
    $bulkCopy = New-Object System.Data.SqlClient.SqlBulkCopy($connectionString)
    $bulkCopy.DestinationTableName = "TestTable"
    $bulkCopy.WriteToServer($flattenedData)

    # Log the result
    Write-Output "Data inserted successfully."

} else {
    # Log the error
    Write-Error "Failed to retrieve data from the endpoint: $($response.StatusCode) $($response.ReasonPhrase)"
}
