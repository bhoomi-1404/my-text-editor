# ✨ Modern Text Editor

A **powerful, elegant, and fast** text editor built with **React** — designed for seamless editing, rich customizations, and efficient keyboard-driven workflows.

---

## 🚀 Features

### ✍️ Core Text Formatting
- **Bold** — `Cmd+B`
- **Italic** — `Cmd+I`
- **Underline** — `Cmd+U`
- **Quote** — `Cmd+Q`

### 🧹 Undo and Redo
- **Undo** — `Cmd+Z`
- **Redo** — `Cmd+Shift+Z`

### 🧽 Navigation & Command Menu
- **Open Command Menu** — `/`
- **Navigate Elements** — `Tab`
- **Close Menus** — `Escape`

---

## ⚡ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/text-editor.git
   cd text-editor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 🚩 Deployment

You can view the live deployed project [here](https://my-text-editor-git-main-bhoomika-goyals-projects.vercel.app).

---

## 👢 File Structure

```
/text-editor
├── /public
│   └── index.html
├── /src
│   ├── /components
│   │   ├── CommandMenu.jsx
│   │   ├── CustomEditor.jsx
│   │   ├── KeyboardShortcutsGuide.jsx
│   │   ├── NewToolBar.jsx
│   │   ├── PropertiesPanel.jsx
│   │   └── /Properties
│   │       ├── ButtonProperties.jsx
│   │       ├── CheckboxProperties.jsx
│   │       └── ImageProperties.jsx
│   ├── /hooks
│   │   ├── useCommandMenu.js
│   │   ├── useDragAndDrop.js
│   │   ├── useEditorState.js
│   │   ├── useInteractiveElements.js
│   │   └── useKeyboardShortcuts.js
│   ├── App.jsx
│   ├── index.js
│   ├── App.css
├── package.json
└── README.md
```

---

## 🛠️ Explanation of Key Files

| File/Folder | Description |
| :--- | :--- |
| `/public/index.html` | The main HTML file where the React app is mounted. |
| `/src/components/CommandMenu.jsx` | Handles the command menu interactions. |
| `/src/components/CustomEditor.jsx` | Core component for text editing. |
| `/src/components/KeyboardShortcutsGuide.jsx` | Displays all keyboard shortcuts. |
| `/src/components/NewToolBar.jsx` | Toolbar with formatting buttons. |
| `/src/components/PropertiesPanel.jsx` | Panel for editing element properties. |
| `/src/components/Properties/*` | Customize properties of buttons, checkboxes, and images. |
| `/src/hooks/` | Custom React hooks for command menu, drag and drop, editor state, interactive elements, and keyboard shortcuts. |
| `/src/App.jsx` | Main application setup and UI layout. |
| `/src/index.js` | Application entry point. |
| `/src/App.css` | Global styling for the editor. |

---

## 🎹 Keyboard Shortcuts Guide

| Shortcut | Action |
| :--- | :--- |
| `Cmd+B` | Bold |
| `Cmd+I` | Italic |
| `Cmd+U` | Underline |
| `Cmd+Q` | Quote |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `/` | Open Command Menu |
| `Tab` | Navigate elements |
| `Escape` | Close menus |

---

## 🖋️ How to Use

- **Start typing** — it's that simple!
- **Select text** and format it using the toolbar **or** use the **keyboard shortcuts** for blazing-fast editing.
- **Customize elements** like buttons, checkboxes, and images through the **Properties Panel**.
- **Use the Command Menu** (`/`) to quickly trigger actions without leaving your keyboard.

---

> _"Built for creators who love speed and simplicity."_ 🚀
