# Animated Heart Web Application

This is a web-based animated heart application that can be deployed on Vercel.

## Project Structure

```
Test/
├── index.html              # Main HTML file
├── heart.js                # JavaScript animation logic
├── PythonApplication2.py   # Original Python tkinter version (reference)
├── vercel.json             # Vercel configuration
├── package.json            # Project configuration
└── README.md               # This file
```

## Features

- Animated heart using HTML5 Canvas
- Smooth particle animations
- Responsive design
- Fully client-side (no backend required)

## Local Development

To test locally, you can:

1. Simply open `index.html` in your web browser, or
2. Use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Then visit http://localhost:8000
   ```

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the Test folder:
   ```bash
   cd d:\DA\Project\Test
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and your site will be deployed!

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository (or upload the Test folder)
4. Vercel will automatically detect the configuration
5. Click "Deploy"

### Option 3: Deploy via Git

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com)
4. Import your GitHub repository
5. Deploy!

## Configuration

You can customize the heart color by modifying the `HEART_COLOR` constant in `heart.js`:

```javascript
const HEART_COLOR = "#f76070"; // Change this to your preferred color
```

## Notes

- The original Python version (`PythonApplication2.py`) used tkinter which cannot run on Vercel
- This web version achieves the same visual effect using HTML5 Canvas
- No backend or build process is required - it's a static site
- All animations run client-side in the browser

## License

MIT
