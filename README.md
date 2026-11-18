<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Rhytam23/asia101">
    <img src="public/favicon.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">MEKONG SMART LAND SYSTEM</h3>

  <p align="center">
    Satellite-Powered Climate Decision Intelligence Platform for Vietnamese Agriculture
    <br />
    <a href="https://github.com/Rhytam23/asia101"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Rhytam23/asia101/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/Rhytam23/asia101/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

**Satellite-Powered Climate Decision Intelligence Platform for Vietnamese Agriculture**


**v1.0 — Production-Ready Hackathon Prototype**

The MEKONG SMART LAND SYSTEM is an enterprise-grade, satellite-powered decision intelligence platform designed for the Vietnamese Mekong Delta. It combines real-time satellite data (Sentinel-1/2, MODIS, CHIRPS), soil science, weather, market signals, and transparent AI decision engines to help farmers, cooperatives, government agencies, and researchers make climate-resilient crop, water, and economic decisions.

**Core Philosophy**: The interactive GIS map is the primary interface. Every recommendation, chart, and dashboard updates reactively when a location is selected. All calculations are fully transparent and auditable.

### 🌍 Key Features


- **Professional GIS Map** (Leaflet): Multi-layer base maps (OSM, Satellite, Terrain, Dark), province/district/commune boundaries, dynamic heatmaps, search + click, smooth flyTo.
- **Live Data Services**: Real Open-Meteo weather, SoilGrids v2.0, Nominatim admin lookup + deterministic fallbacks.
- **Decision Intelligence Engine**: Fully explainable multi-factor scoring (salinity, water, market, rotation, weather, soil, satellite, historical). 7+ influence factors per recommendation.
- **Economic Decision Module**: Side-by-side Current vs Recommended crop with Revenue / Cost / Profit, payback, investment, subsidy, market demand + Bar/Pie/Line charts.
- **Demo Mode**: 5 realistic pre-configured scenarios (Normal Season, Flood Warning, Drought, High Salinity, Government Response) for live 5-minute demos.
- **Role Dashboards** (instant client-side switching):
  - Farmer
  - Cooperative
  - Government (Enterprise Command Center)
  - Researcher
- **Live Operations**: SMS preview, alerts, real-time monitoring.
- **Trust & Transparency**: Every recommendation shows Confidence, Supporting datasets, Influences (Weather/Soil/Market/Historical/Satellite), Water Analysis, Risk Assessment, Uncertainty, Expected Benefit, Known Limitations, Last Updated, Calculation Formula, and Confidence Contributions table.
- **Data Audit**: All critical datasets display Source + Last Updated + Confidence Level. Marked demonstration data where live APIs are impractical.

---

### 📁 Repository Structure


```
├── src/
│   ├── components/
│   │   ├── ProfessionalGISMap.tsx          # Core map (Leaflet)
│   │   ├── DecisionIntelligence.tsx        # Trust + explainability
│   │   ├── EconomicDecision.tsx            # Economic comparison
│   │   ├── DemoModeSelector.tsx
│   │   ├── dashboards/                     # 4 role dashboards + shared
│   │   └── shared/
│   ├── pages/
│   │   ├── SmartMap.tsx                    # Main integration hub
│   │   ├── RoleDashboards.tsx
│   │   └── ...
│   ├── services/                           # Clean modular data services
│   │   ├── weatherService.ts
│   │   ├── soilService.ts
│   │   ├── decisionEngine.ts
│   │   ├── economicService.ts
│   │   └── ...
│   ├── hooks/useLocationData.ts            # Unified reactive data loader
│   ├── context/DemoModeContext.tsx
│   ├── data/mockData.ts                    # Labeled demonstration data
│   └── types/
├── api/                                    # API contracts & specs
├── db/                                     # Database schemas
├── docs/                                   # Full documentation
├── .github/workflows/                      # CI/CD
├── Dockerfile
├── docker-compose.yml
├── vercel.json
├── .env.example
└── README.md
```

---

### 📊 Data Sources & Transparency


All datasets explicitly declare:

- **Source**
- **Last Updated**
- **Confidence Level**

**Primary Live Sources**:
- Open-Meteo (weather)
- ISRIC SoilGrids v2.0
- Nominatim (admin boundaries)
- MARD / MONRE reference data (demonstration)

**Demonstration Data**:
- Provinces, satellite points, historical events — explicitly labeled.

---

### 🏗️ Architecture Highlights


- **Map-first**: All modules subscribe to `useLocationData` + `handleLocationSelect`.
- **Modular Decision Engine**: `decisionEngine.ts` is pure and can be swapped for ML.
- **Economic Service**: Transparent formulas + assumptions surfaced in UI.
- **Client-only**: No backend required for v1.0 (easy to add later).
- **Enterprise UX**: Loading states, skeletons, error boundaries, responsive, accessible.

---

### 🚢 Deployment


#### Local
```bash
npm run dev
```

#### Docker
```bash
docker-compose up --build
```

#### Vercel
```bash
vercel
# or push to GitHub (see .github/workflows)
```

#### Production Recommendations
- Add real authentication (JWT / OAuth)
- Replace mock services with production APIs (GEE, MARD, VNPT SMS)
- Add PostgreSQL / TimescaleDB for historical data
- Enable server-side caching (Redis)
- Add rate limiting & monitoring

---

### 📚 Full Documentation


See `/docs/`:

- [Architecture](./docs/ARCHITECTURE.md)
- [API Design](./docs/API.md)
- [Database Design](./docs/DATABASE.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Developer Guide](./docs/DEVELOPER_GUIDE.md)
- [GIS Documentation](./docs/GIS.md)
- [AI & Recommendation Engine](./docs/AI_ENGINE.md)
- [Data Pipeline](./docs/DATA_PIPELINE.md)
- [Security](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Roadmap](./docs/ROADMAP.md)

Also explore in-app Documentation page at `/docs`.

---

### 🛡️ Security


See [SECURITY.md](./SECURITY.md)

Report vulnerabilities responsibly to the maintainers.

---

### 📖 Project Understanding (Future Reference)


The Mekong Smart Land System is a climate decision-intelligence platform for Vietnamese
agriculture. It pulls real satellite (Sentinel-1/2, MODIS), weather (Open-Meteo) and soil
(SoilGrids) data onto an interactive GIS map, then runs an explainable multi-factor scoring
engine (salinity, water, market, weather, soil, satellite, history) to recommend crop, water and
economic decisions — with a demo mode of five pre-built scenarios for a fast live pitch.

**Stack:** React + TypeScript + Vite + Leaflet (frontend) · Python (`main.py`) API backend ·
Docker/Vercel deployable.
**Status:** the project's own README calls it a "Production-Ready Hackathon Prototype" — this is
a hackathon build first, product-shaped second.

### 🎯 Where This Can Be Used


- Agri-tech / climate-resilience portfolio piece, or a base to pitch to NGOs/government agencies.
- Reference implementation for "real satellite data + explainable scoring + role dashboards"
  pattern, reusable on other geo-data problems.
- **Hackathons:** yes — it was built for one. The demo-mode scenarios and role dashboards
  (Farmer/Cooperative/Government/Researcher) are ready to reuse as a template for any future
  climate/agri hackathon entry that needs a credible live demo in under 5 minutes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
* [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
* [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
* [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
* [![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
* [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### 🚀 Quick Start


```bash
# 1. Clone
git clone <repo-url>
cd mekong-smart-land-system

# 2. Install
npm install

# 3. Run development
npm run dev

# 4. Build for production
npm run build
npm run preview
```

Visit `http://localhost:5173` — the **Smart Map** (`/gis-map`) is the primary interface.

---

### 🔧 Environment Variables


Copy `.env.example` → `.env.local`

| Variable              | Description                              | Default / Required |
|-----------------------|------------------------------------------|--------------------|
| `VITE_OPENMETEO_URL`  | Open-Meteo API base                      | (public)           |
| `VITE_SOILGRIDS_URL`  | SoilGrids API                            | (public)           |
| `VITE_NOMINATIM_URL`  | Nominatim geocoding                      | (public)           |
| `VITE_DEMO_MODE`      | Force demo mode on load                  | false              |

Live APIs are used with graceful fallbacks.

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

### 🧪 Demo Mode (Recommended for Presentations)


The floating **Demo Mode Selector** (bottom-right) instantly switches the entire platform into one of 5 deterministic scenarios:

1. Normal Season
2. Flood Warning
3. Drought
4. High Salinity
5. Government Response

Every panel (map, weather, soil, recommendations, economic comparison, Government dashboard, SMS preview, etc.) updates reactively.

---

### 🧪 Testing & Quality


```bash
npm run build          # TypeScript + production build
npm run lint
```

Current status (v1.0):
- ✅ `npm run build` succeeds cleanly
- ✅ TypeScript strict clean
- ✅ All core paths reactive to map
- ✅ Demo Mode fully integrated
- ✅ Trust/Explainability present everywhere

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap


- Full backend REST API + PostgreSQL
- Real SMS integration (Twilio / VNPT)
- Google Earth Engine direct integration
- Farmer mobile PWA
- Cooperative multi-farm analytics
- ML model training pipeline
- Offline mode + sync
- Multi-language (Vietnamese + English)

---

**Built for the Mekong Delta. Designed for Hackathons. Ready for Production.**

*Satellite intelligence for climate-resilient Vietnamese agriculture.*

---

**Last Updated**: 2026-07-03 (v1.0 Release)

---

See the [open issues](https://github.com/Rhytam23/asia101/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing


See [CONTRIBUTING.md](./CONTRIBUTING.md)

We welcome contributions focused on:
- Real Vietnamese government data integration
- Additional crop models
- SMS gateway integration
- ML model swaps
- Accessibility & mobile UX

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License


MIT License — see [LICENSE](./LICENSE)

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Rhytam Biswas - [@Rhytam23](https://github.com/Rhytam23)

Project Link: [https://github.com/Rhytam23/asia101](https://github.com/Rhytam23/asia101)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/Rhytam23/asia101.svg?style=for-the-badge
[contributors-url]: https://github.com/Rhytam23/asia101/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Rhytam23/asia101.svg?style=for-the-badge
[forks-url]: https://github.com/Rhytam23/asia101/network/members
[stars-shield]: https://img.shields.io/github/stars/Rhytam23/asia101.svg?style=for-the-badge
[stars-url]: https://github.com/Rhytam23/asia101/stargazers
[issues-shield]: https://img.shields.io/github/issues/Rhytam23/asia101.svg?style=for-the-badge
[issues-url]: https://github.com/Rhytam23/asia101/issues
[license-shield]: https://img.shields.io/github/license/Rhytam23/asia101.svg?style=for-the-badge
[license-url]: https://github.com/Rhytam23/asia101/blob/main/LICENSE
