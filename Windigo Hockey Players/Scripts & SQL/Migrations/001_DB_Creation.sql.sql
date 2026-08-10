go
create database Windigo_Hockey_Rating_System_DB
go
USE Windigo_Hockey_Rating_System_DB;
-- ===============================
-- Windigo Hockey Database Schema 
-- ===============================

-- ============
-- 1. RINKS
-- ============
CREATE TABLE RINKS (
    rink_id INT NOT NULL,
    rink_name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(50),
    latitude FLOAT,
    longitude FLOAT,
    CONSTRAINT PK_Rinks PRIMARY KEY (rink_id)
);

-- ===============
-- 2. SEASONS
-- ===============
CREATE TABLE SEASONS (
    season_id INT NOT NULL,
    season_type VARCHAR(50) NOT NULL,
    year_start INT NOT NULL,
    year_end INT NOT NULL,
    CONSTRAINT PK_Seasons PRIMARY KEY (season_id)
);

-- ===============
-- 3. TEAMS
-- ===============
CREATE TABLE TEAMS (
    team_id INT NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    league VARCHAR(50),
    season_flag BIT,
    rink_id INT NOT NULL,
    CONSTRAINT PK_Teams PRIMARY KEY (team_id),
    CONSTRAINT FK_Teams_Rinks FOREIGN KEY (rink_id)
        REFERENCES RINKS(rink_id)
);

-- ===============
-- 4. PLAYERS
-- ===============
CREATE TABLE PLAYERS (
    player_id INT NOT NULL,
    team_id INT NULL,   -- nullable for free agents
    name VARCHAR(100) NOT NULL,
    position VARCHAR(20),
    birth_year INT,
    CONSTRAINT PK_Players PRIMARY KEY (player_id),
    CONSTRAINT FK_Players_Teams FOREIGN KEY (team_id)
        REFERENCES TEAMS(team_id)
);

-- =======================================
-- 5. ROSTER (Historical team assignments)
-- =======================================
CREATE TABLE ROSTER (
    roster_id INT NOT NULL identity(1,1),
    player_id INT NOT NULL,
    team_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    CONSTRAINT PK_Roster PRIMARY KEY (roster_id),
    CONSTRAINT FK_Roster_Players FOREIGN KEY (player_id)
        REFERENCES PLAYERS(player_id) ON DELETE CASCADE,
    CONSTRAINT FK_Roster_Teams FOREIGN KEY (team_id)
        REFERENCES TEAMS(team_id)
);

-- ===========
-- 6. GAMES
-- ===========
CREATE TABLE GAMES (
    game_id INT NOT NULL identity(1,1),
    season_id INT NOT NULL,
    date DATETIME NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    home_score INT NOT NULL,
    away_score INT NOT NULL,
    rink_id INT NOT NULL,
    source_url VARCHAR(500),
    CONSTRAINT PK_Games PRIMARY KEY (game_id),
    CONSTRAINT FK_Games_Seasons FOREIGN KEY (season_id)
        REFERENCES SEASONS(season_id),
    CONSTRAINT FK_Games_HomeTeam FOREIGN KEY (home_team_id)
        REFERENCES TEAMS(team_id),
    CONSTRAINT FK_Games_AwayTeam FOREIGN KEY (away_team_id)
        REFERENCES TEAMS(team_id),
    CONSTRAINT FK_Games_Rinks FOREIGN KEY (rink_id)
        REFERENCES RINKS(rink_id)
);

-- ===================
-- 7. TRAVEL_DISTANCE
-- ===================
CREATE TABLE TRAVEL_DISTANCE (
    game_id INT NOT NULL,
    home_distance FLOAT,
    away_distance FLOAT,
    CONSTRAINT PK_TravelDistance PRIMARY KEY (game_id),
    CONSTRAINT FK_TravelDistance_Games FOREIGN KEY (game_id)
        REFERENCES GAMES(game_id) ON DELETE CASCADE
);

-- ===================
-- 8. STRENGTH_UPDATE
-- ===================
CREATE TABLE STRENGTH_UPDATE (
    strength_update_id INT NOT NULL,
    game_id INT NOT NULL,
    team_id INT NOT NULL,
    season_id INT NOT NULL,
    strength_before FLOAT,
    strength_after FLOAT,
    travel_bonus FLOAT,
    opponent_strength FLOAT,
    CONSTRAINT PK_StrengthUpdate PRIMARY KEY (strength_update_id),
    CONSTRAINT FK_StrengthUpdate_Games FOREIGN KEY (game_id)
        REFERENCES GAMES(game_id) ON DELETE CASCADE,
    CONSTRAINT FK_StrengthUpdate_Teams FOREIGN KEY (team_id)
        REFERENCES TEAMS(team_id),
    CONSTRAINT FK_StrengthUpdate_Seasons FOREIGN KEY (season_id)
        REFERENCES SEASONS(season_id)
);

-- ================
-- 9. PLAYER_STATS
-- ================
CREATE TABLE PLAYER_STATS (
    game_id INT NOT NULL,
    player_id INT NOT NULL,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    shots INT DEFAULT 0,
    CONSTRAINT PK_PlayerStats PRIMARY KEY (game_id, player_id),
    CONSTRAINT FK_PlayerStats_Games FOREIGN KEY (game_id)
        REFERENCES GAMES(game_id) ON DELETE CASCADE,
    CONSTRAINT FK_PlayerStats_Players FOREIGN KEY (player_id)
        REFERENCES PLAYERS(player_id) ON DELETE CASCADE
);

-- =================
-- 10. GOALIE_STATS
-- =================
CREATE TABLE GOALIE_STATS (
    goalie_stats_id INT NOT NULL,
    game_id INT NOT NULL,
    player_id INT NOT NULL,
    shots_against INT DEFAULT 0,
    saves INT DEFAULT 0,
    shutout_flag BIT DEFAULT 0,
    CONSTRAINT PK_GoalieStats PRIMARY KEY (goalie_stats_id),
    CONSTRAINT FK_GoalieStats_Games FOREIGN KEY (game_id)
        REFERENCES GAMES(game_id) ON DELETE CASCADE,
    CONSTRAINT FK_GoalieStats_Players FOREIGN KEY (player_id)
        REFERENCES PLAYERS(player_id) ON DELETE CASCADE
);

-- ========================
-- 11. PLAYER_DRAFT_STATUS
-- ========================
CREATE TABLE PLAYER_DRAFT_STATUS (
    draft_status_id INT NOT NULL,
    player_id INT NOT NULL,
    season_id INT NOT NULL,
    drafted_flag BIT DEFAULT 0,
    drafted_by_team VARCHAR(100),
    drafted_round INT,
    drafted_overall INT,
    draft_type VARCHAR(50),
    CONSTRAINT PK_PlayerDraftStatus PRIMARY KEY (draft_status_id),
    CONSTRAINT FK_PlayerDraftStatus_Players FOREIGN KEY (player_id)
        REFERENCES PLAYERS(player_id) ON DELETE CASCADE,
    CONSTRAINT FK_PlayerDraftStatus_Seasons FOREIGN KEY (season_id)
        REFERENCES SEASONS(season_id)
);

-- =========================
-- 12. PLAYER_MODEL_OUTPUTS
-- =========================
CREATE TABLE PLAYER_MODEL_OUTPUTS (
    model_output_id INT NOT NULL,
    player_id INT NOT NULL,
    season_id INT NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    draft_score FLOAT,
    draft_rank INT,
    draft_probability FLOAT,
    time_created DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_PlayerModelOutputs PRIMARY KEY (model_output_id),
    CONSTRAINT FK_PlayerModelOutputs_Players FOREIGN KEY (player_id)
        REFERENCES PLAYERS(player_id) ON DELETE CASCADE,
    CONSTRAINT FK_PlayerModelOutputs_Seasons FOREIGN KEY (season_id)
        REFERENCES SEASONS(season_id)
);
