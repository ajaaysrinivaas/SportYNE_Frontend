# SportYNE Frontend

SportYNE is a wellness management platform for athletes, coaches, and general users. This repository contains the frontend application built with Next.js, providing dynamic dashboards, interactive visualizations, and a responsive user interface.

## Features
- Athlete and coach dashboards with personalized data views  
- Google API integration for file and data sync  
- Dynamic Canvas visualizations for performance metrics  
- Responsive styling with TailwindCSS  
- GSAP animations and Iconify icons for polished interactions  
- Bundle size analysis support  
- Dockerfile for containerized builds

## Tech Stack
- Framework: Next.js  
- Styling: TailwindCSS  
- Animations: GSAP  
- Icons: Iconify  
- Data fetching: SWR (uses native fetch)  
- Charts: Chart.js, react-chartjs-2  
- Analysis: @next/bundle-analyzer  

## Prerequisites
- Node.js 20.x  
- Yarn 1.x  
- Docker (for container builds)

## Getting Started

1. Install dependencies  
   ```bash
   yarn install
   ```

2. Run development server on http://localhost:3000  
   ```bash
   yarn dev
   ```

3. Build for production  
   ```bash
   yarn build
   ```

4. Start production server  
   ```bash
   yarn start
   ```

5. Clean install (remove node_modules and reinstall)  
   ```bash
   yarn clean-install
   ```

6. Run linting rules  
   ```bash
   yarn lint
   ```

7. Perform TypeScript type checking  
   ```bash
   yarn type-check
   ```

8. Generate bundle analysis report  
   ```bash
   yarn analyze
   ```

## Docker

1. Build the Docker image  
   ```bash
   yarn docker:build
   ```

2. Run the container and expose port 3000  
   ```bash
   docker run -p 3000:3000 my-nextjs-app
   ```

## Environment Variables

Create a `.env.local` file in the project root with any required keys, for example:

- `NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here`
- `NEXT_PUBLIC_API_BASE_URL=https://api.yoursportyne.com`

## Project Status

This version was rebuilt and relaunched under solo independent development for clear ownership. Functionality is stable; ongoing improvements and additional features are planned.

## License

MIT License  
Developed and maintained by Ajaay Srinivaas