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

This project is configured for easy deployment to Vercel. Choose one of the following methods:

### Method 1: GitHub Integration (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com) and sign in (or create an account)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and configure the build settings
   - Click "Deploy"

3. **Automatic deployments:**
   - Every push to `main` will trigger a new deployment
   - Pull requests will create preview deployments

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts to link your project
   - For production deployment, run `vercel --prod`

3. **Environment variables (if needed):**
   ```bash
   vercel env add VARIABLE_NAME
   ```

### Configuration

The project includes a `vercel.json` file with optimal settings. Vercel will automatically:
- Detect Next.js framework
- Run `npm install` and `npm run build`
- Serve the app with optimal caching and performance

### Custom Domain

After deployment:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Build for Production

```bash
npm run build
npm start
```
