import os
import requests
import pandas as pd
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth

# Load environment variables from .env file
load_dotenv()

CLIENT_ID = os.getenv('WEBEX_CLIENT_ID')
CLIENT_SECRET = os.getenv('WEBEX_CLIENT_SECRET')
REDIRECT_URI = os.getenv('WEBEX_REDIRECT_URI')
AUTH_CODE = os.getenv('WEBEX_AUTH_CODE')  # Temporary code obtained from initial OAuth2 flow
ACCESS_TOKEN_URL = "https://webexapis.com/v1/access_token"
MEETINGS_URL = "https://webexapis.com/v1/meetings"
ATTENDEES_URL = "https://webexapis.com/v1/meetingParticipants"
SCOPE = "meeting:schedules_read meeting:participants_read"

# Authorization URL for OAuth2 (This needs to be visited manually for now)
AUTH_URL = (
    f"https://webexapis.com/v1/authorize?"
    f"client_id={CLIENT_ID}&"
    f"response_type=code&"
    f"redirect_uri={REDIRECT_URI}&"
    f"scope={SCOPE}&"
    f"state=random_state_value"
)

print(f"Visit the following URL to authorize the app:\n{AUTH_URL}")

# Function to get access token
def get_access_token():
    response = requests.post(
        ACCESS_TOKEN_URL,
        data={
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': AUTH_CODE,
            'redirect_uri': REDIRECT_URI
        },
    )

    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        raise Exception(f"Failed to get access token: {response.text}")

# Function to get completed meetings
def get_completed_meetings(access_token, start_date):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    params = {
        'from': start_date,
        'state': 'ended'
    }

    response = requests.get(MEETINGS_URL, headers=headers, params=params)

    if response.status_code == 200:
        return response.json().get('items', [])
    else:
        raise Exception(f"Failed to fetch meetings: {response.text}")

# Function to get attendees for a given meeting ID
def get_meeting_attendees(access_token, meeting_id):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    params = {
        'meetingId': meeting_id
    }

    response = requests.get(ATTENDEES_URL, headers=headers, params=params)

    if response.status_code == 200:
        return response.json().get('items', [])
    else:
        raise Exception(f"Failed to fetch attendees for meeting {meeting_id}: {response.text}")

# Main function to gather data and export to Excel
def export_meeting_attendance_to_excel():
    # Step 1: Get access token
    access_token = get_access_token()

    # Step 2: Fetch all completed meetings since June 1, 2024
    start_date = "2024-06-01T00:00:00Z"
    meetings = get_completed_meetings(access_token, start_date)

    # Step 3: Collect meeting and attendee data
    data = []
    for meeting in meetings:
        meeting_id = meeting['id']
        meeting_name = meeting['title']
        meeting_start = meeting['start']
        meeting_end = meeting['end']

        # Fetch attendees for each meeting
        attendees = get_meeting_attendees(access_token, meeting_id)
        for attendee in attendees:
            data.append({
                'Meeting Name': meeting_name,
                'Meeting Start': meeting_start,
                'Meeting End': meeting_end,
                'Attendee Name': attendee['displayName'],
                'Attendee Email': attendee['email'],
                'Attendance Duration': attendee['duration'],
                'Attendee Status': attendee['status']  # e.g., attended, did not attend
            })

    # Step 4: Export the collected data to Excel
    df = pd.DataFrame(data)
    df.to_excel('webex_meeting_attendance.xlsx', index=False)
    print("Export completed: webex_meeting_attendance.xlsx")

# Execute the script
if __name__ == "__main__":
    export_meeting_attendance_to_excel()
