# Portfolio Website

A modern, artistic portfolio website built with React and Vite, featuring a beautiful gradient background and clean design.

## Features

- 🎨 Artistic gradient background with animated effects
- 👤 Profile section with picture, name, and social links
- 📱 Responsive design for all devices
- 🚀 Fast performance with Vite
- 🎯 Recent projects showcase section
- 🔗 Social media integration (YouTube, GitHub, LinkedIn, X/Twitter)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Customization

### 1. Update Your Profile Information

Edit `src/App.jsx` and update:

- **Name**: Change `"Your Name"` in the profile section
- **Roles**: Update `"SWE/ML | Dev Advocate | @ 🫠"` with your roles
- **Profile Picture**: 
  - Add your profile picture as `public/profile-picture.jpg`, or
  - Update the `src` attribute in the profile picture `img` tag

### 2. Update Social Media Links

In `src/App.jsx`, update the `href` attributes in the social links section:

```jsx
<a href="https://youtube.com/@yourchannel" ...>
<a href="https://github.com/yourusername" ...>
<a href="https://linkedin.com/in/yourprofile" ...>
<a href="https://x.com/yourusername" ...>
```

### 3. Add Your Projects

Update the `projects` array in `src/App.jsx`:

```jsx
const [projects] = useState([
  {
    id: 1,
    title: "Your Project Title",
    date: "19 February 2026",
    words: "850 words",
    readTime: "5 mins",
    description: "Your project description here...",
    thumbnail: "path/to/your/thumbnail.jpg"
  },
  // Add more projects...
])
```

### 4. Update Navigation Links

Modify the navigation links in the header:

```jsx
<a href="#tutorials">Tutorials</a>
<a href="#resources">Resources</a>
<a href="#about">About</a>
<a href="#resume">Resume</a>
```

### 5. Update Buy Me a Coffee Link

Change the coffee button link:

```jsx
<a href="https://buymeacoffee.com/yourusername" ...>
```

### 6. Customize Colors

Edit `src/App.css` to change the gradient colors in `.background-artwork`:

```css
background: linear-gradient(135deg, 
  #ff6b6b 0%, 
  #ffa500 25%, 
  /* Add your colors here */
);
```

## Project Structure

```
profileaman/
├── public/
│   └── profile-picture.jpg  (add your profile picture here)
├── src/
│   ├── App.jsx              (main component)
│   ├── App.css              (styles)
│   ├── index.css            (global styles)
│   └── main.jsx             (entry point)
├── index.html
└── package.json
```

## Technologies Used

- React 19
- Vite
- CSS3 (with animations and gradients)

## License

MIT
