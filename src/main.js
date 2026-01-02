const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const mm = require("music-metadata");

function CreateWindow() {
    const win = new BrowserWindow({
        width: 300,
        height: 335,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile("src/index.html")
}

ipcMain.handle("select-music-folder", async() => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory"]
    })

    if (result.canceled) return [];

    const folderPath = result.filePaths[0];
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    const coverExtensions = [".png", ".jpg", ".jpeg"]

    const songs = []

    for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!/\.(mp3|wav|ogg)$/i.test(entry.name)) continue;

        const filePath = path.join(folderPath, entry.name);
        const baseName = path.parse(entry.name).name;
        let title = baseName;
        let cover = null;

        for (const ext of coverExtensions) {
            const possibleCover = path.join(folderPath, baseName + ext);
            if (fs.existsSync(possibleCover)) {
                cover = `file://${encodeURI(possibleCover.replace(/\\/g, "/"))}`;
                break;
            }
        }

        if (!cover) {
            cover = `file://${encodeURI(
            path.join(__dirname, "src", "images", "cover-default.png")
                .replace(/\\/g, "/")
            )}`
        }

        try {
            const metadata = await mm.parseFile(filePath);

            if (metadata.common.title) {
                title = metadata.common.artist
                ? `${metadata.common.artist} - ${metadata.common.title}`
                : metadata.common.title;
            }

             if (metadata.common.picture?.length) {
                const pic = metadata.common.picture[0];
                cover = `data:${pic.format};base64,${pic.data.toString("base64")}`;
            }
        } catch(err) {
            console.warn("Metadata Fehler:", entry.name);
        }

        songs.push({
            title,
            path: filePath,
            cover
        });
    }

    return songs;
})

app.whenReady().then(CreateWindow);