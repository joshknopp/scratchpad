import requests
import pandas as pd
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import BackendApplicationClient
import datetime

# WebEx API OAuth2 credentials (replace with your values)
CLIENT_ID = 'your_client_id'
CLIENT_SECRET = 'your_client_secret'
AUTH_URL = 'https://webexapis.com/v1/authorize'
TOKEN_URL = 'https://webexapis.com/v1/access_token'
REDIRECT_URI = 'http://localhost:8080/callback'  # Change if needed

# Helper function to authenticate using OAuth2 (SSO)
def authenticate():
    oauth = OAuth2Session(CLIENT_ID, redirect_uri=REDIRECT_URI)
    
    # Get authorization URL
    authorization_url, state = oauth.authorization_url(AUTH_URL)
    print(f'Visit this URL to authorize the app: {authorization_url}')
    
    # After authorization, WebEx will redirect to the redirect URL with a code
    redirect_response = input('Paste the full redirect URL here: ')
    
    # Fetch the access token
    token = oauth.fetch_token(TOKEN_URL, client_secret=CLIENT_SECRET,
                              authorization_response=redirect_response)
    return token['access_token']

# Function to get completed meetings since a given date
def get_completed_meetings(token, start_date):
    url = 'https://webexapis.com/v1/meetings'
    headers = {'Authorization': f'Bearer {token}'}
    params = {
        'from': start_date,
        'to': datetime.datetime.utcnow().isoformat(),
        'state': 'ended'
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Raise an error for bad responses
    return response.json()['items']

# Function to get participants for a given meeting
def get_meeting_participants(token, meeting_id):
    url = f'https://webexapis.com/v1/meetingParticipants'
    headers = {'Authorization': f'Bearer {token}'}
    params = {'meetingId': meeting_id}
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()['items']

# Function to export meeting and attendee data to an Excel file
def export_to_excel(meetings, filename='webex_meetings.xlsx'):
    data = []
    for meeting in meetings:
        for participant in meeting['participants']:
            data.append({
                'Meeting Date': meeting['start'],
                'Meeting Name': meeting['title'],
                'Attendee Name': participant['name'],
                'Attendance Duration (minutes)': participant['duration'],
                'Email': participant['email']
            })
    
    # Create DataFrame and export to Excel
    df = pd.DataFrame(data)
    df.to_excel(filename, index=False)
    print(f'Data exported to {filename}')

def main():
    # Authenticate and get access token
    token = authenticate()

    # Retrieve completed meetings since June 1, 2024
    start_date = '2024-06-01T00:00:00Z'  # ISO 8601 format
    meetings = get_completed_meetings(token, start_date)

    # For each meeting, retrieve participant details
    for meeting in meetings:
        meeting_id = meeting['id']
        participants = get_meeting_participants(token, meeting_id)
        meeting['participants'] = participants

    # Export data to Excel
    export_to_excel(meetings)

if __name__ == '__main__':
    main()
