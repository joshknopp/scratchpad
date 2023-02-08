# Import the required modules
Import-Module -Name 'System.Net.Http'
Import-Module -Name 'Newtonsoft.Json'

# Define the endpoint URL
$endpoint = "http://example.com/api/data?key="

# Define the API key
$apiKey = "your_api_key_here"

# Define the list of keys
$keys = @(1, 2, 3)

# Loop through the list of keys
foreach ($key in $keys) {

    # Use the HttpClient class to make the request
    $client = New-Object System.Net.Http.HttpClient
    $client.DefaultRequestHeaders.Add("Authorization", "Bearer $apiKey")
    $response = $client.GetAsync($endpoint + $key).Result

    # Check if the response was successful
    if ($response.IsSuccessStatusCode) {

        # Get the JSON content from the response
        $jsonContent = $response.Content.ReadAsStringAsync().Result

        # Use Newtonsoft.Json to deserialize the JSON content
        $data = [Newtonsoft.Json.JsonConvert]::DeserializeObject<PSObject>($jsonContent)

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

    } else {
        # Log the error
        Write-Error "Failed to retrieve data for key $key from the endpoint: $($response.StatusCode) $($response.ReasonPhrase)"
    }
}
