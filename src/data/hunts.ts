export interface Hunt {
  id: string;
  title: string;
  description: string;
  clue: string;
  points: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  landmark: string; // what the AI vision will look for
  difficulty: "easy" | "medium" | "hard";
  borough: string;
}

export const hunts: Hunt[] = [
  {
    id: "1",
    title: "The Charging Bull",
    description: "Find the iconic Wall Street bull in the Financial District.",
    clue: "Follow the money — where traders pray and tourists pose, a bronze beast charges through lower Manhattan.",
    points: 100,
    coordinates: { lat: 40.7056, lng: -74.0134 },
    address: "Broadway & Morris St, New York, NY 10004",
    landmark: "Charging Bull statue",
    difficulty: "easy",
    borough: "Manhattan",
  },
  {
    id: "2",
    title: "Brooklyn Bridge Selfie",
    description: "Snap a photo at the iconic Brooklyn Bridge walkway.",
    clue: "Two boroughs, one bridge. Walk above the cars and find the stone towers that have stood since 1883.",
    points: 150,
    coordinates: { lat: 40.7061, lng: -73.9969 },
    address: "Brooklyn Bridge Pedestrian Walkway, New York, NY",
    landmark: "Brooklyn Bridge tower and cables",
    difficulty: "easy",
    borough: "Manhattan/Brooklyn",
  },
  {
    id: "3",
    title: "Flatiron Building",
    description: "Capture the unique triangular Flatiron Building.",
    clue: "Where Broadway and Fifth Avenue collide, a building shaped like a clothes iron cuts through the block.",
    points: 100,
    coordinates: { lat: 40.7411, lng: -73.9897 },
    address: "175 5th Ave, New York, NY 10010",
    landmark: "Flatiron Building triangular facade",
    difficulty: "easy",
    borough: "Manhattan",
  },
  {
    id: "4",
    title: "Vessel at Hudson Yards",
    description: "Find the honeycomb-like Vessel structure at Hudson Yards.",
    clue: "A beehive for humans on the West Side. 154 flights of stairs that go nowhere and everywhere.",
    points: 200,
    coordinates: { lat: 40.7539, lng: -74.0022 },
    address: "20 Hudson Yards, New York, NY 10001",
    landmark: "Vessel honeycomb structure",
    difficulty: "medium",
    borough: "Manhattan",
  },
  {
    id: "5",
    title: "DUMBO Cobblestones",
    description: "Find the famous view of the Manhattan Bridge between the buildings.",
    clue: "Down Under the Manhattan Bridge Overpass — stand between two brick warehouses and frame a bridge in the gap.",
    points: 250,
    coordinates: { lat: 40.7033, lng: -73.9894 },
    address: "Washington St & Water St, Brooklyn, NY 11201",
    landmark: "Manhattan Bridge framed between buildings on Washington Street",
    difficulty: "medium",
    borough: "Brooklyn",
  },
  {
    id: "6",
    title: "Oculus at World Trade Center",
    description: "Photograph the stunning white Oculus transit hub.",
    clue: "A white dove frozen in flight — or perhaps a ribcage of steel — marks the gateway to the memorial.",
    points: 150,
    coordinates: { lat: 40.7127, lng: -74.0128 },
    address: "90 Vesey St, New York, NY 10007",
    landmark: "Oculus white steel structure",
    difficulty: "easy",
    borough: "Manhattan",
  },
  {
    id: "7",
    title: "Katz's Delicatessen Sign",
    description: "Find the legendary Katz's Deli on the Lower East Side.",
    clue: "Since 1888, they've been slicing pastrami. The neon sign hangs on Houston — send a salami to your boy in the army.",
    points: 200,
    coordinates: { lat: 40.7223, lng: -73.9874 },
    address: "205 E Houston St, New York, NY 10002",
    landmark: "Katz's Delicatessen neon sign",
    difficulty: "medium",
    borough: "Manhattan",
  },
  {
    id: "8",
    title: "The High Line",
    description: "Find the elevated park built on a historic freight rail line.",
    clue: "An old rail line turned green — walk above the streets of Chelsea and find the section with the wooden deck chairs.",
    points: 175,
    coordinates: { lat: 40.7480, lng: -74.0048 },
    address: "The High Line, New York, NY 10011",
    landmark: "High Line elevated park rail tracks and greenery",
    difficulty: "easy",
    borough: "Manhattan",
  },
];
