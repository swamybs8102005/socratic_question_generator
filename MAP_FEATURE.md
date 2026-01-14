# Map-Based Questions Feature

## Overview
The system now supports interactive map-based questions, particularly useful for history, geography, and related subjects. When asking about historical topics (dynasties, empires, battles, etc.), questions can include interactive maps where learners identify locations.

## How It Works

### 1. Question Detection
The system automatically detects history-related topics using keywords like:
- history, dynasty, empire, kingdom
- war, civilization, ancient, medieval
- colonial, geography, etc.

### 2. Map Question Structure
Map questions include:
- **Title**: Name of the historical period/region
- **Visual Map**: Interactive display with location markers
- **Markers**: 3-5 clickable locations on the map
- **Question**: "Identify the capital of..." or similar
- **Options**: Multiple choice answers corresponding to map locations

### 3. Interactive Features
- **Click to Select**: Learners click on map markers to select their answer
- **Visual Feedback**: Selected locations highlight in the difficulty color
- **Hover Effects**: Pulsing animations and labels on hover
- **Correct/Incorrect Indicators**: After submission, markers show ✓ or ✗

## Example Questions

### Vijayanagara Dynasty
```
Question: "Identify the capital city of the Vijayanagara Empire"
Map: Shows South India with markers for:
  - Hampi (correct answer) ✓
  - Penukonda
  - Bijapur
  - Golconda
```

### Mauryan Empire
```
Question: "Locate the capital founded by Chandragupta Maurya"
Map: Shows ancient India with markers for:
  - Pataliputra (correct answer) ✓
  - Taxila
  - Ujjain
  - Varanasi
```

## Implementation Details

### Type Definitions
- Added `MapLocation` question type
- `MapData` interface with title, imageUrl, and markers
- `MapMarker` interface with id, name, coordinates, and correctness flag

### Components
- **HistoricalMap.tsx**: Main map display component
  - Renders interactive map with decorative elements
  - Handles marker clicks and selection
  - Shows correct/incorrect feedback
  - Includes compass and grid decorations

- **QuestionCard.tsx**: Updated to support map questions
  - Detects and displays map when `question.mapData` exists
  - Integrates map selection with answer submission

### Question Generation
- **question-generator.ts**: Extended prompt to include map generation rules
- **mock-questions.ts**: Includes sample map questions for testing

## Visual Design

### Map Styling
- Ancient/historical aesthetic with amber/brown tones
- Decorative compass rose in corner
- Grid lines for authentic map appearance
- Antique-style border around map

### Markers
- Pin-style markers with different colors:
  - **Amber** (#f59e0b): Unselected locations
  - **Difficulty Color**: Selected location
  - **Green** (#10b981): Correct answer (after submission)
  - **Red** (#ef4444): Incorrect selection (after submission)
- Pulsing rings on hover/selection
- Labels appear below each marker

### Interactions
- **Hover**: Marker scales up, label becomes fully visible
- **Click**: Marker changes color, pulsing effect appears
- **Submit**: Markers update to show correct/incorrect with checkmarks/X marks

## Usage

### For Learners
1. Read the question about a historical location
2. Examine the map and marker labels
3. Click on the location you believe is correct
4. Adjust confidence slider
5. Submit answer
6. View feedback with correct location highlighted

### For Educators
The system automatically generates map questions when detecting history topics. You can:
- Ask about specific dynasties: "Vijayanagara dynasty"
- Request location identification: "capital of Mauryan empire"
- Inquire about historical regions: "Indus Valley Civilization"

## Future Enhancements

### Potential Additions
1. **Custom Map Images**: Upload actual historical maps instead of placeholders
2. **Multiple Correct Answers**: For questions about regions or multiple capitals
3. **Time-based Maps**: Show empire expansion/contraction over time
4. **Drag-and-Drop**: Allow learners to place markers themselves
5. **Distance Feedback**: "You were X km away from the correct location"
6. **Map Zoom**: Interactive zoom for detailed regional questions
7. **Trade Routes**: Show and identify historical trade paths
8. **Battle Locations**: Military history questions with battle sites

## Technical Notes

### Coordinate System
- Uses percentage-based positioning (0-100 range for lat/lng)
- Relative to map container dimensions
- Easy to adapt to actual geographic coordinates later

### Performance
- SVG-based map decorations for scalability
- Framer Motion for smooth animations
- Lazy loading of map images when URLs provided

### Accessibility
- Keyboard navigation support
- Clear visual feedback for selections
- High contrast colors for visibility
- Text labels on all markers

## Testing

### Mock Questions
The system includes 4 sample map questions for testing:
1. Vijayanagara Empire capital
2. Indus Valley Civilization location
3. Mauryan Empire capital
4. Chola Dynasty center

### Testing Steps
1. Start a session with topic "Indian history" or "Vijayanagara dynasty"
2. Request MCQ questions
3. System will generate map-based questions
4. Verify marker interactions work correctly
5. Check correct/incorrect feedback after submission
