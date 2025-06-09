# GitHub Time Travel (Fake Commit History) - Web UI

An application for generating fake GitHub commit histories! Select dates on a contribution graph, generate a Windows batch script (`.bat`), and fill your GitHub profile with as many commits as you want.

![Thumbnail](/public/thumbnail.png)


## Features

- Interactive contribution graph (like GitHub's)
- Left click to add a commit, right click to undo
- Color legend shows how many commits per day
- Generates a `.bat` script to create fake commits for selected dates
- Easy to copy or download the script

## Getting Started

### Option 1: Use the Web UI

https://fake-commit-history-github.vercel.app

### Option 2: Local Use
1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Click on any square to add a commit for that day (left click = add, right click = undo)
- The color intensity shows how many commits are selected for each day
- Click "Generate Script" to preview the batch file
- Download or copy the script, then run it in your git repository
- Push your changes to GitHub to see your new contribution graph

> **⚠️ Note:**
> The generated `.bat` file may be detected and blocked by Windows Defender or other antivirus software. This is because it automates file creation and git commands. If you trust the script, you may need to allow it manually in your security settings.

![Warning](/public/warning.png)

## Disclaimer

- This tool is for educational and demonstration purposes only.
- Do not use fake commit histories to mislead employers or for unethical purposes.
- The generated `.bat` file may trigger antivirus warnings. Review the script before running and use at your own risk.

## License

MIT
