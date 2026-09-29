require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.BRAWL_STARS_API_KEY;



async function getPlayer(playerTag) {
    const encodedTag = encodeURIComponent(playerTag);

    const response = await fetch(
        `https://api.brawlstars.com/v1/players/${encodedTag}`,
        {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Accept": "application/json"
            }
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Erreur API : ${response.status}\n${errorText}`
        );
    }

    return await response.json();
}

const server = http.createServer(async (req, res) => {

    // Récupération des données du joueur
    if (req.url === "/api/player") {

        try {
            const player = await getPlayer(playerTag);

            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8"
            });

            res.end(JSON.stringify(player));

        } catch (error) {
            console.log(error)

            res.writeHead(500, {
                "Content-Type": "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                error: error.message
            }));
        }

        return;
    }

    // Fichiers du dossier public
    let filePath;

    if (req.url === "/") {
        filePath = path.join(__dirname, "public", "index.html");
    } else {
        filePath = path.join(__dirname, "public", req.url);
    }

    fs.readFile(filePath, (error, data) => {

        if (error) {
            res.writeHead(404);
            res.end("Fichier introuvable.");
            return;
        }

        let contentType = "text/plain";

        if (filePath.endsWith(".html")) {
            contentType = "text/html; charset=utf-8";
        }

        if (filePath.endsWith(".css")) {
            contentType = "text/css; charset=utf-8";
        }

        if (filePath.endsWith(".js")) {
            contentType = "text/javascript; charset=utf-8";
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);
    });
});

server.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});



let body= "";

req.on("data", data => {
    body = body + data;
});

req.on("end", () =>{
    const playerData =JSON.parse(body);
    playerTag = playerData.playerTag;
    getPlayer(playerTag);
});