export const MIN_YEAR = 2016;

export const MAX_COORD_JUMP = 8;

export const HIGH_CONTRAST_KEY = "high_contrast_active"

type colorPerYear = {
    year: number;
    color: string;
}

export const pinColors: colorPerYear[] = [
    {year: 0, color: "#606060"},
    {year: 1, color: "#000000"},
    {year: 2015, color: "#FF0000"}, // Red
    {year: 2016, color: "#FF7F00"}, // Orange
    {year: 2017, color: "#FFFF00"}, // Yellow
    {year: 2018, color: "#ADFF2F"}, // Yellow-Green
    {year: 2019, color: "#00FF00"}, // Light Green
    {year: 2020, color: "#005300"}, // Dark Green
    {year: 2021, color: "#0000FF"}, // Turquoise
    {year: 2022, color: "#4B0082"}, // Blue
    {year: 2023, color: "#8A2BE2"}, // Indigo
    {year: 2024, color: "#EE82EE"}, // Violet
    {year: 2025, color: "#fb00ab"},  // Light Violet / Pinkish end
    {year: 2026, color: "#9c006b"}
];

export const MAIL_URL = 'mailto:maurice.ferreyra@gmail.com';

export const GITHUB_URL = 'https://github.com/Laszlu'

export const HELP_UI = 'THE STATUS BAR ABOVE THE MAP SHOWS THE CURRENTLY SELECTED CATEGORY AND REGION AND NUMBER OF EVENTS, AS WELL AS THE APP´S ONLINE STATUS (YOUR INTERNET CONNECTION + ITS CONNECTION TO THE SERVER)'

export const HELP_CATEGORY = 'THIS BUTTON OPENS THE MENU TO CHANGE THE CURRENTLY DISPLAYED CATEGORY OF EVENTS';

export const HELP_REGION = 'THIS BUTTON OPENS THE MENU TO CHANGE THE CURRENTLY DISPLAYED REGION FOR THE SELECTED CATEGORY';

export const HELP_COMPARISON = 'THIS BUTTON OPENS THE MENU FOR THE YEAR-BY-YEAR COMPARISON FOR EVENTS, FOCUSED ON A SPECIFIC CATEGORY AND REGION. TO SET UP THE COMPARISON, SELECT A CATEGORY, REGION AND YEARS FOR START AND END, THEN START THE COMPARISON.';

export const HELP_SETTINGS = 'THIS BUTTON OPENS THE SETTINGS MENU, WHERE GENERAL APP-SETTINGS LIKE HIGH-CONTRAST-MODE CAN BE ENABLED';

export const ABOUT_WELCOME = 'WELCOME TO TERRALERT';

export const ABOUT_DEV = 'THIS APP IS BEING DEVELOPED BY LASZLO FERREYRA AS A MASTERS DEGREE MAJOR PROJECT FOR SAE INSTITUTE BERLIN';

export const ABOUT_DATA = 'DISCLAIMER:\n THE DATA BEING USED IN THIS APP IS PROVIDED BY NASA´S EONET V3 API. ACCORDING TO NASA, THIS DATA IS FOR GENERAL PURPOSES ONLY AND SHOULD NOT BE CONSTRUED AS "OFFICIAL" WITH REGARDS TO SPACIAL OR TEMPORAL EXTENT.';