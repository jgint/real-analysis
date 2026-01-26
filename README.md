# Real Analysis Visualizations

Interactive visualizations of key theorems and proofs in real analysis, built with Next.js and optimized for Vercel deployment.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Project Structure

```
├── app/
│   ├── page.jsx              # Homepage with directory of visualizations
│   ├── layout.jsx            # Root layout
│   └── heine-borel/
│       └── page.jsx          # Route for Heine-Borel visualization
├── components/
│   └── HeineBorel.jsx        # Heine-Borel visualization component
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## Adding New Visualizations

1. Create a new component in `components/` (e.g., `components/MyVisualization.jsx`)
2. Create a new route in `app/` (e.g., `app/my-visualization/page.jsx`)
3. Add an entry to the `visualizations` array in `app/page.jsx`

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and configure the build

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Build for Production

```bash
npm run build
npm start
```
