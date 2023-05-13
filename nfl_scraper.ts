const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape the schedule data
const scrapeSchedule = async () => {
  try {
    const response = await axios.get(
      'https://sports.yahoo.com/complete-week-week-schedule-18-013625599.html?src=rss'
    );

    const $ = cheerio.load(response.data);

    // Find all <h2> tags
    const weekHeaders = $('h2');

    // Initialize variables to store date and time
    let currentDate = '';
    let currentTime = '';

    // Initialize an empty array to store the schedule data
    const scheduleData = [];

    // Iterate over each week header
    weekHeaders.each((weekIndex, weekHeader) => {
      const weekText = $(weekHeader).text().trim();
      const weekNumber = weekText.replace('WEEK ', '');

      // Find the corresponding <p> tags containing game information
      const gameInfoParagraphs = $(weekHeader).nextUntil('h2', 'p');

      // Iterate over each game info paragraph
      gameInfoParagraphs.each((gameIndex, gameInfoParagraph) => {
        const gameText = $(gameInfoParagraph).text().trim();

        // Check if the paragraph contains a date
        if ($(gameInfoParagraph).find('strong').length > 0) {
          // Update the current date
          currentDate = $(gameInfoParagraph).find('strong').text().trim();
        } else {
          // Extract the relevant information from the game text
          const [teamsString, timeString, networkString] = gameText.split(',').map((item) => item.trim());

          // Exclude game entries with "Matchup TBD" team names
          if (teamsString.includes('Matchup TBD')) {
            return;
          }

          // Exclude entries with null week values
          if (!weekNumber) {
            return;
          }

          // Exclude malformed entries with nonsensical team names
          if (!teamsString.includes('at')) {
            return;
          }

          // Default date if "TBD" is encountered
          const defaultDate = 'Sunday, Jan. 7 1:00 p.m.';

          // Concatenate the date and time strings
          const datetime = currentDate.includes('TBD') ? defaultDate : `${currentDate} ${timeString}`;

          // Remove the day of the week from datetime expressions
          const datetimeWithoutDay = datetime.replace(/(\w+),\s+/, '');

          // Create an object to store the schedule information for a single game
          const gameData = {
            week: parseInt(weekNumber),
            datetime: datetimeWithoutDay,
            team1: teamsString.split(' at ')[0],
            team2: teamsString.split(' at ')[1],
            network: networkString,
          };

          // Add the game data to the schedule array
          scheduleData.push(gameData);
        }
      });
    });

    // Remove items with null week values
    const filteredScheduleData = scheduleData.filter((gameData) => !isNaN(gameData.week));

    // Convert the schedule data to JSON format
    const scheduleJson = JSON.stringify(filteredScheduleData, null, 4);

    // Print the JSON data to the console
    console.log(scheduleJson);

    // Write the JSON data to a file
    const filename = 'schedule.json';

      const filePath = path.join(__dirname, filename);

    fs.writeFile(filePath, scheduleJson, (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log(`JSON file '${filename}' has been saved with ${filteredScheduleData.length} results.`);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

// Invoke the scrapeSchedule function
scrapeSchedule();
