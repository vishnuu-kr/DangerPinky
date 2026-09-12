<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />

# DangerPinky 🎯
> **Control the cute snake with your pinky finger. Feed it your real files!**

DangerPinky is a desktop & web game that turns a harmless classic Snake game into an adrenaline-pumping, uselessly high-stakes experience. Steer an adorable candy-pink snake using only your webcam and pinky finger gestures. Instead of apples, the snake eats real files discovered from a local folder — and in Danger Mode, each file eaten is moved directly to your OS Recycle Bin!

---

## Basic Details

### Project Description
Control a cute pink snake using your webcam and pinky finger. In Safe Demo Mode, the snake eats simulated files. In Danger Mode, the snake eats real files from a chosen directory and sends them straight to your computer's Recycle Bin in real time!

### The Problem (that doesn't exist)
Decluttering your Downloads and Desktop folders is boring, tedious, and lacks emotional thrill. Why manually delete old files when you can let a cute little snake eat them by flicking your pinky at your webcam?

### The Solution (that nobody asked for)
DangerPinky gamifies accidental file destruction:
1. Webcam MediaPipe AI tracks your little finger / pinky tip in real-time.
2. The snake slithers around eating local files rendered as delicious candy fruits with filename badges.
3. In Danger Mode, each bite executes an IPC operation safely moving the file to your OS Trash / Recycle Bin!

---

## 🌟 Key Features

- 👆 **Pinky-First Computer Vision**:
  - MediaPipe Hand Landmarker (21 landmarks) running client-side with WebAssembly.
  - Pinky TIP (Landmark 20) is the steering wheel.
  - Exponential moving average (EMA) coordinate smoothing & deadzone filtering to discard micro-jitters.
  - Dominant axis detection (`|dx|` vs `|dy|`), directional cooldown lockout, and suicide-turn prevention.
  - Hand out-of-view auto-pause & camera recovery.

- 📁 **Files Become Food (Candy Theme)**:
  - 3D candy fruits (Apples, Watermelons, Cherries, Grapes, Oranges, Strawberries) with specular gloss shines and clear file badges.
  - **Safe Demo Mode**: 27 simulated files across diverse extensions.
  - **Real Danger Mode**: Electron native filesystem integration with two-step token confirmation and Recycle Bin safety.

- 🎵 **Procedural Audio Synthesizer**:
  - Built with Web Audio API — zero external audio assets or downloads required.
  - Category-tuned eat chimes, countdown beeps, wall collision thuds, and fanfare.

- 🎮 **Customizable Engine**:
  - **Grid Sizes**: 10×10 (Standard ⭐), 12×12, 14×14, 16×16 (Large), 20×20, 24×24.
  - **Game Modes**: Classic (Lethal boundary walls) and Wrap-Around (Portal edges).
  - **Speed Presets**: Chill, Classic, Fast, Dynamic.
  - **Controls**: Webcam Hand/Pinky tracking, Keyboard (WASD / Arrows), and zero-latency Touch D-Pad.

---

## Technical Details

### Technologies Used
- **Frontend / UI**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Desktop Runtime**: Electron 34, Node.js IPC, Native Trash / Recycle Bin APIs
- **Computer Vision**: Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
- **Testing**: Vitest (39 automated tests covering engine, tracking, security validator, and filesystem transactions)

---

## Implementation

### Installation
```bash
# Clone the repository
git clone https://github.com/vishnuu-kr/DangerPinky.git
cd DangerPinky

# Install dependencies
npm install
```

### Run Web Mode (Browser)
```bash
npm run dev
```

### Run Desktop Mode (Electron with Real Danger Mode)
```bash
npm run desktop
# or after building:
npm start
```

### Run Automated Tests
```bash
npm test
```

---

## 🕹️ Controls

| Action | Pinky Gesture | Keyboard Fallback | Touch / Mobile |
| :--- | :--- | :--- | :--- |
| **Move Up** | Flick pinky Up | `ArrowUp` / `W` | On-screen Up arrow |
| **Move Down** | Flick pinky Down | `ArrowDown` / `S` | On-screen Down arrow |
| **Move Left** | Flick pinky Left | `ArrowLeft` / `A` | On-screen Left arrow |
| **Move Right** | Flick pinky Right | `ArrowRight` / `D` | On-screen Right arrow |
| **Pause / Resume** | Hand leaves camera | `Space` / `Escape` | Pause button in HUD |

---

Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
