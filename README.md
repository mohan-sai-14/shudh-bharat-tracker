# Bharat Shudh - Real-Time Pollution Tracker

A real-time pollution tracking application for monitoring air and water quality across India.

## Features

- Real-time Air Quality Index (AQI) monitoring
- Water Quality Index (WQI) tracking
- Location-based pollution data
- Interactive pollution maps
- Community reporting system
- Historical pollution trends
- Mobile-responsive design

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router
- Supabase
- Leaflet Maps
- Recharts

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_OPENCAGE_API_KEY=your_opencage_api_key
VITE_AIRVISUAL_API_KEY=your_airvisual_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
