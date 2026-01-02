# Electron Local Music Player

A compact **Electron.js desktop music player** that loads a local music folder, plays audio files, and automatically extracts metadata such as title, artist, and cover art.

The project is intentionally minimal and well‑suited as a learning resource or a solid foundation for Electron applications using IPC communication between the main and renderer processes.

---

## Features

* Select a local music folder via native system dialog
* Support for **MP3, WAV, and OGG** files
* Automatic metadata extraction (title, artist, cover art)
* Fallback cover image if no artwork is available
* Playback controls:

  * Play / Pause
  * Next / Previous track
  * Progress bar with seek support
  * Volume control
* Cyclic playback (playlist loops automatically)

---

## Project Structure

```text
project-root/
├─ main.js              # Electron main process
├─ renderer.js          # Renderer logic (UI & audio handling)
├─ package.json
└─ src/
   ├─ index.html        # User interface
   └─ images/
      ├─ cover-default.png
      ├─ Pause.svg
      └─ Start.svg
```

---

## Technologies & Dependencies

* **Electron** – Desktop application framework
* **Node.js** – File system and path handling
* **music-metadata** – Reading audio and ID3 metadata
* **HTML5 Audio API** – Audio playback in the renderer process

---

## Installation

1. Clone or download the repository
2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```

---

## How It Works

### Main Process (`main.js`)

* Creates a fixed-size application window (300 × 335)
* Opens a folder selection dialog
* Scans the selected folder for supported audio files
* Extracts:

  * Track title (from filename or metadata)
  * Artist name
  * Cover art (embedded, external image, or fallback)
* Sends the resulting song list to the renderer via **IPC**

### Renderer Process (`renderer.js`)

* Receives the song list from the main process
* Initializes an `Audio` object
* Handles playback, navigation, and volume control
* Updates UI elements such as:

  * Progress bar
  * Track title
  * Cover image

---

## Cover Art Logic

The application uses the following priority order:

1. Embedded cover art from audio metadata
2. External image file with the same base name (`.png`, `.jpg`, `.jpeg`)
3. `cover-default.png` as a fallback image

---

## Limitations & Notes

* No playlist management or sorting
* No metadata caching
* `nodeIntegration` is enabled (acceptable for learning projects, not recommended for production use)

---

## Possible Improvements

* Playlist support
* Shuffle / repeat modes
* Keyboard shortcuts
* Dark / light theme
* Disable `nodeIntegration` and use a secure preload script

---

## License

This project is free to use for learning and development purposes.

---

## Target Audience

Suitable for developers who:

* Want to learn Electron
* Want to understand IPC communication
* Need a simple local music player as a base project