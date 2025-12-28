export const MIN_YEAR = 2015;

export const MAX_COORD_JUMP = 10;

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
    {year: 2025, color: "#fb00ab"}  // Light Violet / Pinkish end
];