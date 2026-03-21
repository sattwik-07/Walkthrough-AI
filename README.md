# WalkThrough AI History

> **Explore the world's history — powered by AI, maps, and real-time data.**

WalkThrough AI History is an interactive web application that lets you discover historical landmarks through an immersive map experience, AI-generated insights, and live weather data — making history more accessible and engaging than ever.

---
##  Features
| Feature | Description |
|---------|-------------|
|  **Interactive Map** | Navigate historical places with smooth, visually rich map-based exploration powered by Mapbox |
|  **Landmark Discovery** | Browse and explore historical monuments, their significance, and nearby places |
|  **AI-Powered Insights** | Get AI-generated historical context, descriptions, and interesting facts for every location |
|  **Live Weather** | Real-time weather conditions for any selected location via OpenWeather API |
|  **Fast & Responsive** | Optimized UI that works seamlessly across devices |

---

##  Tech Stack

- **Framework** — [Next.js](https://nextjs.org/)
- **Styling** — [Tailwind CSS](https://tailwindcss.com/)
- **Maps** — [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- **AI** — OpenAI / Vercel AI SDK
- **Weather** — [OpenWeather API](https://openweathermap.org/api)
- **Deployment** — [Vercel](https://vercel.com/)

---

##  Getting Started

### Prerequisites

- Node.js `18+`
- npm or yarn
- API keys for Mapbox, OpenWeather, and OpenAI

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/walk-through-ai-history.git

# Navigate into the project
cd walk-through-ai-history

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add your API keys:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
OPENWEATHER_API_KEY=your_openweather_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
walk-through-ai-history/
├── app/
├── explore/        # Monuments explorer page
│   ├── map/            # Interactive map page
│   ├── ai-guide/       # AI guide feature
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
├── lib/                # API helpers and utilities
├── public/             # Static assets
└── .env.local          # Environment variables (not committed)
```

---

## Live Demo

 [walk-through-ai-histroy.vercel.app](https://walk-through-ai-histroy.vercel.app/)

---

##  Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---


---
