import requests

import json

from bs4 import BeautifulSoup

# URL for the NFL regular season schedule

url = 'https://www.nfl.com/schedules/2023/reg1/'

# Send a GET request to the URL

response = requests.get(url)

# Create a Beautiful Soup object from the response content

soup = BeautifulSoup(response.content, 'html.parser')

# Create an empty list to store the scraped data

data = []

# Loop through each week of the regular season

for week in range(1, 19):

    # Construct the URL for the week's schedule

    week_url = f'https://www.nfl.com/schedules/2023/reg{week}/'

    # Send a GET request to the week's schedule URL

    week_response = requests.get(week_url)

    # Create a Beautiful Soup object from the week's schedule content

    week_soup = BeautifulSoup(week_response.content, 'html.parser')

    # Find the HTML elements containing the data you want to scrape

    # and extract the relevant information using Beautiful Soup's

    # built-in methods such as find() and find_all().

    

        

    # Assuming you want to scrape the game schedule details

    game_elements = week_soup.find_all('div', class_='nfl-o-matchup-group__container')

    # Extract the desired information from each game element

    for game_element in game_elements:

        # Extract the necessary data from the game element

        date = game_element.find('div', class_='nfl-c-matchup-time').text.strip()

        teams = game_element.find_all('span', class_='nfl-c-matchup-team-name')

        team1 = teams[0].text.strip()

        team2 = teams[1].text.strip()

        # Create a dictionary to store the extracted data

        game_data = {

            'week': week,

            'date': date,

            'team1': team1,

            'team2': team2

        }

        # Add the game data to the list

        data.append(game_data)

# Output the scraped data as JSON to the console

# Output the scraped data as JSON to the console

print(json.dumps(data, indent=4))

    

    
