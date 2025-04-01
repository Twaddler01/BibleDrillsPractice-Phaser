import MainScene from "./MainScene.js";

// Override console.log, console.warn, and console.error for exporting into a file
function logExport() {
    var logs = [];
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    console.log = function (message) {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        logs.push(`LOG: ${message}`);
        originalConsoleLog(message);
    };

    console.warn = function (message) {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        logs.push(`WARNING: ${message}`);
        originalConsoleWarn(message);
    };

    console.error = function (message) {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        logs.push(`ERROR: ${message}`);
        originalConsoleError(message);
    };

    let exportButton = document.createElement('button');
    exportButton.id = 'exportButton';
    exportButton.innerHTML = 'Export Logs';
    document.getElementById('bottomOfPage').appendChild(exportButton);

    exportButton.addEventListener("click", function () {
        // Save logs to a file
        let logString = logs.join('\n');

        // Create a Blob containing the text data
        const blob = new Blob([logString], { type: 'text/plain' });

        // Create a download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'logs.txt';

        // Append the link to the document
        document.getElementById('bottomOfPage').appendChild(link);

        // Trigger the download
        link.click();

        // Remove the link from the document
        document.getElementById('bottomOfPage').removeChild(link);
    });
}

// Allow exporting of HTML to inspect/debug elements
function htmlExport() {
    // Create the "Export HTML" button
    const exportHTMLButton = document.createElement('button');
    exportHTMLButton.id = 'exportHTMLButton';
    exportHTMLButton.textContent = 'Export HTML';
    
    // Append the button to the document body
    document.body.appendChild(exportHTMLButton);
    
    // Add an event listener to the "Export HTML" button
    exportHTMLButton.addEventListener("click", function () {
        // Get the HTML content of the entire document
        let htmlContent = document.documentElement.outerHTML;
    
        // Create a Blob containing the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
    
        // Create a download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'page.html';
    
        // Append the link to the document
        document.getElementById('bottomOfPage').appendChild(link);
    
        // Trigger the download
        link.click();
    
        // Remove the link from the document
        document.getElementById('bottomOfPage').removeChild(link);
    });
}

// DEBUGGING FUNCTIONS
logExport();
htmlExport();

// PHASER

// Phaser game configuration
const MAX_WIDTH = 600; // Max width for mobile portrait
const ASPECT_RATIO = 16 / 9; // Adjust if needed

// Function to calculate dynamic game size
function getGameSize() {
    let width = Math.min(window.innerWidth, MAX_WIDTH);
    let height = Math.min(window.innerHeight, width * ASPECT_RATIO); // Maintain aspect ratio

    return { width, height };
}

// Get initial size
const { width, height } = getGameSize();

// Phaser configuration
const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: "game-container",
    dom: { createContainer: true },
    scene: [MainScene], // Load the scene
    scale: {
        mode: Phaser.Scale.RESIZE, // Auto-resize the game canvas
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center on resize
    }
};

// Initialize the game
const game = new Phaser.Game(config);

// Handle window resizing
window.addEventListener("resize", () => {
    const { width, height } = getGameSize();
    game.scale.resize(width, height); // Resize the game canvas dynamically
});
