import csv
import json

def csv_to_json(csv_file):
    """
    Converts a CSV file to a JSON array of objects.

    Args:
        csv_file (str): Path to the CSV file.

    Returns:
        list: A list of JSON objects.
    """

    json_data = []
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            json_obj = {}
            for key, value in row.items():
                try:
                    # Attempt to convert to a float, handling potential errors
                    json_obj[key] = float(value)
                except ValueError:
                    # If conversion fails, treat it as a string
                    json_obj[key] = value
            json_data.append(json_obj)
    return json_data

# Example usage:
#csv_file = 'your_csv_file.csv'
#json_data = csv_to_json(csv_file)

# Write the JSON data to a file
#with open('output.json', 'w') as f:
#    json.dump(json_data, f, indent=4)
