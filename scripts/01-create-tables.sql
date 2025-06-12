-- Creating the PhotoSession table
CREATE TABLE PhotoSession (
    PS_ID INTEGER PRIMARY KEY,
    Ps_Name VARCHAR(100) NOT NULL,
    PS_Date DATE NOT NULL,
    PS_StartTime TIME NOT NULL,
    PS_EndTime TIME NOT NULL,
    PS_Status VARCHAR(20) NOT NULL
);

-- Creating the User table
CREATE TABLE "User" (
    U_ID INTEGER PRIMARY KEY,
    U_Username VARCHAR(50) NOT NULL,
    U_Password VARCHAR(100) NOT NULL,
    U_Email VARCHAR(100) NOT NULL,
    U_FullName VARCHAR(100) NOT NULL,
    U_PhoneNumber VARCHAR(15) NOT NULL,
    U_UserType VARCHAR(10) NOT NULL,
    U_Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    U_IsActive BOOLEAN NOT NULL
);

-- Creating the Photographer table
CREATE TABLE Photographer (
    P_ID INTEGER PRIMARY KEY,
    P_PortfolioUrl VARCHAR(255) NOT NULL,
    P_ExperienceYears INTEGER NOT NULL,
    P_Specialty VARCHAR(100) NOT NULL,
    P_Rating DECIMAL(3, 2) NOT NULL,
    P_Price_per_hour DECIMAL(10, 2) NOT NULL,
    P_IsAvailable BOOLEAN NOT NULL,
    P_Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    User_U_ID INTEGER NOT NULL,
    FOREIGN KEY (User_U_ID) REFERENCES "User" (U_ID)
);

-- Creating the Bookings table
CREATE TABLE Bookings (
    B_ID INTEGER PRIMARY KEY,
    B_Date DATE NOT NULL,
    B_StartTime TIME NOT NULL,
    B_EndTime TIME NOT NULL,
    B_Total_Price DECIMAL(12, 2) NOT NULL,
    B_Status VARCHAR(20) NOT NULL,
    B_SpecialRequest TEXT,
    B_Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    B_Updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    User_U_ID INTEGER NOT NULL,
    Photographer_P_ID INTEGER NOT NULL,
    PhotoSession_PS_ID INTEGER NOT NULL,
    FOREIGN KEY (User_U_ID) REFERENCES "User" (U_ID),
    FOREIGN KEY (Photographer_P_ID) REFERENCES Photographer (P_ID),
    FOREIGN KEY (PhotoSession_PS_ID) REFERENCES PhotoSession (PS_ID)
);

-- Creating the PhotoSpots table
CREATE TABLE PhotoSpots (
    SP_ID INTEGER PRIMARY KEY,
    SP_Name VARCHAR(100) NOT NULL,
    SP_Location VARCHAR(255) NOT NULL,
    SP_Desc TEXT,
    SP_Capacity INTEGER NOT NULL,
    SP_Price_per_session DECIMAL(10, 2) NOT NULL,
    SP_Facilities TEXT,
    SP_IsAvailable BOOLEAN NOT NULL,
    SP_Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Creating the AvailabilitySchedule table
CREATE TABLE AvailabilitySchedule (
    S_ID INTEGER PRIMARY KEY,
    S_Date DATE NOT NULL,
    S_StartTime TIME NOT NULL,
    S_EndTime TIME NOT NULL,
    Photographer_P_ID INTEGER NOT NULL,
    FOREIGN KEY (Photographer_P_ID) REFERENCES Photographer (P_ID)
);

-- Creating the Bookings_PhotoSpots table (for many-to-many relation)
CREATE TABLE Bookings_PhotoSpots (
    Bookings_B_ID INTEGER NOT NULL,
    PhotoSpots_SP_ID INTEGER NOT NULL,
    PRIMARY KEY (Bookings_B_ID, PhotoSpots_SP_ID),
    FOREIGN KEY (Bookings_B_ID) REFERENCES Bookings (B_ID),
    FOREIGN KEY (PhotoSpots_SP_ID) REFERENCES PhotoSpots (SP_ID)
);
