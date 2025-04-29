// City Types
export interface City {
  name: string;
  lat: number;
  lng: number;
}

// Air Quality Types
export interface AQIComponents {
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface AQIData {
  aqi: number;
  components: AQIComponents;
  timestamp: string;
}

// Water Quality Types
export interface WQIComponents {
  ph: number;
  dissolved_oxygen: number;
  turbidity: number;
  conductivity: number;
  temperature: number;
}

export interface WQIData {
  wqi: number;
  components: WQIComponents;
  timestamp: string;
}

// Combined Pollution Data
export interface PollutionData {
  city: string;
  aqi: AQIData;
  wqi: WQIData;
  timestamp: string;
}

export interface StatePollutionData {
  state: string;
  averageAQI: number;
  averageWQI: number;
  hotspots: PollutionHotspot[];
  lastUpdated: string;
}

export interface PollutionHotspot {
  id: string;
  location: string;
  lat: number;
  lng: number;
  aqi: number;
  wqi: number;
  severity: 'High' | 'Critical' | 'Emergency';
  description: string;
  recommendations: string[];
}

// Pollution Report Types
export interface PollutionReport {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    address?: string;
  };
  type: 'Air' | 'Water' | 'Garbage';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  images: string[];
  status: 'Reported' | 'Investigating' | 'Resolved';
  upvotes: number;
  downvotes: number;
  timestamp: string;
  resolved_timestamp?: string;
}

// Eco Challenge Types
export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  participants: number;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  startDate: string;
  endDate: string;
  type: "Individual" | "Group";
  isActive: boolean;
  image?: string;
  completedBy: string[]; // Array of user IDs
}

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  ecoPoints: number;
  reportCount: number;
  challengesCompleted: number;
  badges: string[];
  joinDate: string;
  avatar?: string;
}

// News Article Types
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedDate: string;
  image?: string;
  category: 'Air' | 'Water' | 'Policy' | 'Community' | 'Technology' | 'Other';
}

// Historical Data Types
export interface HistoricalDataPoint {
  date: string;
  aqi: number;
  wqi: number;
}

export interface HistoricalData {
  city: string;
  data: HistoricalDataPoint[];
}
