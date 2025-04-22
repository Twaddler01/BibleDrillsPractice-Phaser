import MainScene from "./MainScene.js";

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