# Contributing to MEKONG SMART LAND SYSTEM

Thank you for your interest in contributing! We are building a production-grade climate decision intelligence platform for the Mekong Delta.

---

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## How to Contribute

### 1. Reporting Bugs
- Use GitHub Issues
- Include: Steps to reproduce, expected vs actual, environment, screenshots
- Check existing issues first

### 2. Suggesting Features
- Open an issue with the `enhancement` label
- Describe the use case (Farmer / Gov / Cooperative)
- Reference any satellite data, MARD policies, or real-world constraints

### 3. Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/awesome-feature`
3. Make focused changes
4. Ensure `npm run build` succeeds
5. Update documentation if needed
6. Submit PR with clear description

### PR Guidelines
- Keep changes small and reviewable
- Preserve existing design language (`#14532D`, `#22C55E`, rounded-2xl, Inter/IBM Plex)
- **Map remains the primary interface**
- All new recommendations must be fully explainable (no black boxes)
- Add `source`, `lastUpdated`, `confidence` to any new data
- Prefer extending existing services/hooks over new files

---

## Development Setup

```bash
npm install
npm run dev
```

### Useful Commands
```bash
npm run build
npm run lint
```

### Architecture Rules (must follow)
- Use `useLocationData(lat, lng)` for all reactive data
- Decision logic lives in `src/services/decisionEngine.ts`
- Economic calculations in `src/services/economicService.ts`
- Map component: `ProfessionalGISMap.tsx`
- Demo overrides must live in `DemoModeContext`
- Never hardcode numbers in UI — use services or labeled demo data

---

## Areas Needing Help

**High priority**:
- Real MARD / MONRE data integration
- Google Earth Engine scripts
- SMS gateway (VNPT / Twilio)
- Mobile-first PWA improvements
- Vietnamese language support

**Good first issues**:
- Additional crop varieties in decision engine
- More realistic economic assumptions
- Accessibility (WCAG) audit
- Unit tests for decisionEngine
- Improved loading skeletons

---

## Commit Message Format

```
<type>: <short description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(economic): add payback period chart for shrimp-rice
```

---

## Questions?

Open an issue or reach out on the project discussions.

Thank you for helping Vietnamese farmers adapt to climate change! 🌾

---

**Maintainers**: The Mekong Smart Land team (2026)