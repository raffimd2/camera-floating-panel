# camera-floating-panel

A small Electron app that shows your webcam in a floating circular overlay — always on top, draggable, resizable. Designed to sit on top of slides during a podcast or screen recording, the same way Loom or mmhmm do it.

This app only renders video. Audio recording is handled by your screen recorder (ClipChamp, OBS, etc.).

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

## Recording with ClipChamp

Use ClipChamp's **screen recorder** (full-screen mode, not single-window capture) so it captures both your slides and this overlay together. ClipChamp records the mic separately, so your voice gets in fine.

## PowerPoint slideshow caveat

The overlay uses Electron's `screen-saver` always-on-top level, so it stays above normal windows including the PowerPoint window. However, **F5 fullscreen slideshow** in some Windows builds runs as exclusive fullscreen and can cover even top-level windows.

If the overlay disappears in slideshow mode:
- **Slide Show → Set Up Slide Show → Browsed by an individual (window)** — runs slideshow inside a window, overlay stays visible
- Or use **Presenter View on a second monitor** — audience monitor goes fullscreen, your monitor stays windowed, overlay sits on either

This is the same constraint Loom and mmhmm have.

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
