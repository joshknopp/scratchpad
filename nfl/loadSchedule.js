require('dotenv').config(); // Load environment variables from .env file

const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
};

const scheduleFilePath = path.join(__dirname, 'schedule.json');

let teamsData; // Variable to store teams data

async function insertGamesIntoTable() {
  try {
    await sql.connect(config);

    // Retrieve all teams data from tbl_Teams with city and team name concatenated
    const teamsQuery = `SELECT Team_ID, CONCAT(Team_City, ' ', Team_Name) AS Team_Full_Name FROM tbl_Teams`;
    const teamsResult = await sql.query(teamsQuery);
    teamsData = teamsResult.recordset;

    // Read JSON data from schedule file
    const jsonData = fs.readFileSync(scheduleFilePath, 'utf8');
    const jsonPayload = JSON.parse(jsonData);

    // Insert games into tbl_Games
    for (const game of jsonPayload) {
      const homeTeamId = getTeamId(game.team2); // Team 2 is the home team
      const awayTeamId = getTeamId(game.team1); // Team 1 is the away team
      const datetime = formatDatetime(game.datetime);

      const query = `INSERT INTO tbl_Games (Game_Week, Game_Date_Time, Game_Home_Team, Game_Away_Team) 
                     VALUES (@week, @datetime, @homeTeamId, @awayTeamId)`;

      await sql.query(query, {
        week: game.week,
        datetime: datetime,
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId,
      });
    }

    console.log('Games inserted successfully!');
  } catch (error) {
    console.error('Error inserting games:', error);
  } finally {
    sql.close();
  }
}

function getTeamId(teamName) {
  const team = teamsData.find((t) => t.Team_Full_Name === teamName);
  return team ? team.Team_ID : null;
}

function formatDatetime(datetime) {
  const date = new Date(datetime + ' Eastern Time');
  return date.toISOString();
}

insertGamesIntoTable();
