# camera-floating-panel

A small Electron app that shows your webcam in a floating circular overlay — always on top, draggable, resizable. Designed to sit on top of slides during a podcast or screen recording, the same way Loom or mmhmm do it.

This app only renders video. Audio recording is handled by whatever screen recorder you use.

## Run

```bash
npm install
npm start
```

The first launch triggers a Windows camera permission prompt — accept it once and webcam labels will populate after that.

## Controls

Hover over the circle to reveal the controls.

| Action | How |
|---|---|
| Move | Drag anywhere on the circle |
| Resize | Scroll wheel on the circle (120–800 px) |
| Switch camera | Dropdown in the hover bar (auto-refreshes when you plug in a new device) |
| Click-through | 👆 button or **Ctrl+Shift+C** (global hotkey, works even while click-through is on) |
| Minimize / Close | — / ✕ buttons in the hover bar |

The selected camera is remembered across launches.

## Recording

Use your screen recorder's **full-screen capture mode** (not single-window capture) so it picks up both your slides and this overlay together. The recorder handles mic audio on its own — this app stays out of the audio path.

## PowerPoint slideshow

The overlay uses Electron's `screen-saver` always-on-top level, so it stays above PowerPoint — including **F5 fullscreen slideshow on the same screen** (verified on Windows 11). It also works with Presenter View on a second monitor.

If a future Windows build ever blocks it, the workaround is **Slide Show → Set Up Slide Show → Browsed by an individual (window)**, which runs the slideshow inside a regular window where the overlay always sits on top.

## Tech

- Electron 32, frameless transparent `BrowserWindow` (`level: 'screen-saver'`, aspect ratio locked 1:1)
- Vanilla HTML/CSS/JS in the renderer; circle is a plain `border-radius: 50%`
- `getUserMedia` for video, `enumerateDevices` for camera selection, `devicechange` listener for hot-plug
- `localStorage` for remembered camera ID

## Files

```
main.js       — main process (window, IPC, global hotkey)
preload.js    — context bridge for renderer ↔ main
renderer.js   — camera capture + UI wiring
index.html    — DOM
styles.css    — layout, circle clip, hover controls
```
