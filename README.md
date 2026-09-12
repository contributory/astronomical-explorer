# 🌌 Cosmic Explorer - Astronomy & Universe Discovery Application (Streamlit Application)

![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.30+-red.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**Cosmic Explorer** is a multi-functional web application built with **Streamlit** and **Python** that lets users explore the universe and astronomy through public API data sources, real-time up-to-date information, and the latest space news scraping.

---

## ✨ Key Features

1. **🌌 Astronomy Picture of the Day (NASA APOD):**
   - View the daily image and video of the cosmos published by NASA, complete with scientific explanations.
   - Pick a specific date or browse a random image from NASA's archive dating back to 1995.
   - Provides high-definition (HD) image download links.

2. **🛸 International Space Station Tracker (Real-time ISS Tracker):**
   - Interactive online map (Folium Dark Theme) showing the real-time position of the ISS.
   - Displays longitude, latitude, orbital altitude (~400 km) and travel speed (~28,000 km/h).
   - Lists the astronauts currently working in space.

3. **☄️ Near-Earth Asteroid Monitor (NASA NeoWS Asteroid Tracker):**
   - Tracks Near Earth Objects passing close to Earth.
   - Alerts on Potentially Hazardous Asteroids.
   - Interactive 3D Plotly charts analyzing the correlation between diameter, velocity, and distance.

4. **🔴 Mars Rover Gallery (Mars Rovers Gallery):**
   - Explore live images sent back from the surface of Mars by the **Perseverance** and **Curiosity** rovers.
   - Customize the number of images displayed and Sol (Martian day) information.

5. **🪐 3D Solar System Simulation (3D Solar System Explorer):**
   - Interactive 3D orbital motion chart of the planets in the Solar System over time.
   - Computes and lists relative coordinates (in AU) using the `astropy` library.

6. **📰 Space News & Scraping (Space News & Scraping):**
   - Automatically scrapes and aggregates the latest articles from the **Spaceflight News API (SNAPI v4)**.
   - Automatically reads RSS feeds from reputable news sites: *Space.com, NASA News, SciTechDaily*.
   - Supports keyword-based article search.

7. **🌐 Multilingual Support (Multilingual Support):**
   - Seamlessly switch between **Vietnamese** and **English** right from the sidebar.

---

## 🛠️ Installation & Usage Guide

### 1. System Requirements
- Python >= 3.10

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Streamlit App
```bash
streamlit run app.py
```

The app will automatically launch in your browser at: `http://localhost:8501`.

---

## 🧪 Run Unit Tests
To verify that all modules and API endpoints are working correctly:
```bash
python3 -m unittest discover tests
```

---

## 📡 Data Sources & APIs Used
- **NASA Open APIs:** Planetary APOD & NeoWS Asteroid REST API (`api.nasa.gov`)
- **NASA Mars Mission Raw Feeds:** Mars Rover Raw Images (`mars.nasa.gov`)
- **WhereTheISS & Open-Notify:** ISS Real-Time Satellite Tracking & Astronaut Data
- **Spaceflight News API (SNAPI):** Live Spaceflight News Database
- **RSS Feeds:** Space.com, NASA News, SciTechDaily
