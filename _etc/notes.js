//////////////////////////////
//////////////////////////////
//////////////////////////////

To automatically select the previously chosen options when the user returns to the selection page, you can store the values in localStorage (or another persistent state) and then check and apply them when the form is created.

Steps:

1. Store the selections when the user clicks "Continue".


2. Retrieve and apply them when the form loads.


3. Ensure the button is enabled if both values are already selected.



Updated Code:

createSelectionForm() {
    // Create the form container using Phaser DOM (add.dom())
    this.formContainer = this.add.dom(this.width / 2, this.centerY + 100).createFromHTML(`
        <div style="text-align: center; font-family: Arial; color: #ffffff;">
            <div style="display: flex; justify-content: center; gap: 40px;">
                <div>
                    <strong>Color:</strong><br>
                    <input type="radio" id="colorBlue" name="color" value="Blue">
                    <label for="colorBlue">Blue</label><br>
                    <input type="radio" id="colorGreen" name="color" value="Green">
                    <label for="colorGreen">Green</label><br>
                    <input type="radio" id="colorRed" name="color" value="Red">
                    <label for="colorRed">Red</label><br>
                </div>
                <div>
                    <strong>Version:</strong><br>
                    <input type="radio" id="versionKJV" name="version" value="KJV">
                    <label for="versionKJV">KJV</label><br>
                    <input type="radio" id="versionCSB" name="version" value="CSB">
                    <label for="versionCSB">CSB</label><br>
                </div>
            </div>
            <br><br>
            <button id="confirmBtn" disabled>Continue</button>
        </div>
    `);

    const confirmBtn = this.formContainer.getChildByID("confirmBtn");
    const colorRadios = {
        Blue: this.formContainer.getChildByID("colorBlue"),
        Green: this.formContainer.getChildByID("colorGreen"),
        Red: this.formContainer.getChildByID("colorRed"),
    };
    const versionRadios = {
        KJV: this.formContainer.getChildByID("versionKJV"),
        CSB: this.formContainer.getChildByID("versionCSB"),
    };

    // Restore previous selections if available
    const storedColor = localStorage.getItem("selectedColor");
    const storedVersion = localStorage.getItem("selectedVersion");

    if (storedColor && colorRadios[storedColor]) {
        colorRadios[storedColor].checked = true;
    }
    if (storedVersion && versionRadios[storedVersion]) {
        versionRadios[storedVersion].checked = true;
    }

    // Enable the button if both selections are restored
    if (storedColor && storedVersion) {
        confirmBtn.disabled = false;
    }

    // Check if both selections are made and enable the button
    const updateButtonState = () => {
        const colorSelected = Object.values(colorRadios).some(r => r.checked);
        const versionSelected = Object.values(versionRadios).some(r => r.checked);
        confirmBtn.disabled = !(colorSelected && versionSelected);
    };

    [...Object.values(colorRadios), ...Object.values(versionRadios)].forEach(radio => {
        radio.addEventListener("change", updateButtonState);
    });

    // Event listener for the "Continue" button
    confirmBtn.addEventListener("click", () => {
        const selectedColor = Object.keys(colorRadios).find(color => colorRadios[color].checked);
        const selectedVersion = Object.keys(versionRadios).find(version => versionRadios[version].checked);

        // Save selections to localStorage
        localStorage.setItem("selectedColor", selectedColor);
        localStorage.setItem("selectedVersion", selectedVersion);

        this.selectedColor = selectedColor;
        this.selectedVersion = selectedVersion;

        this.startNextPage();
    });
}

How It Works:

1. When the form loads, it retrieves the stored selectedColor and selectedVersion from localStorage and automatically checks the corresponding radio buttons.


2. If both values are set, the "Continue" button is enabled automatically.


3. If the user changes their selection, the button state updates dynamically.


4. When they click "Continue," the selections are saved to localStorage before moving to the next page.



This ensures that when the user returns to the selection screen, their previous choices are pre-selected.



//////////////////////////////
//////////////////////////////
//////////////////////////////

createSelectionForm() {
    // Create the form container using Phaser DOM (add.dom())
    this.formContainer = this.add.dom(this.width / 2, this.centerY + 100).createFromHTML(`
        <div style="text-align: center; font-family: Arial; color: #ffffff;">
            <h2>Choose Color and Version</h2>
            <label for="colorSelect"><strong>Color:</strong> </label>
            <select id="colorSelect">
                <option value="">(Choose)</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Red">Red</option>
            </select><br><br>
            <label for="versionSelect"><strong>Version:</strong> </label>
            <select id="versionSelect">
                <option value="">(Choose)</option>
                <option value="KJV">KJV</option>
                <option value="CSB">CSB</option>
            </select><br><br>
            <button id="confirmBtn" disabled>Continue</button>
        </div>
    `);

    // Use Phaser's dom element to set up the button interaction
    const confirmBtn = this.formContainer.getChildByID("confirmBtn");

    // Set up the event listener for the "Continue" button
    confirmBtn.addEventListener("click", () => {
        const colorSelect = this.formContainer.getChildByID("colorSelect");
        const versionSelect = this.formContainer.getChildByID("versionSelect");

        this.selectedColor = colorSelect.value;
        this.selectedVersion = versionSelect.value;

        console.log("Selected Color: " + this.selectedColor);
        console.log("Selected Version: " + this.selectedVersion);

        // Proceed to the next page or action
        this.startNextPage();
    });

    // Add an event listener to update the button state based on selections
    const colorSelect = this.formContainer.getChildByID("colorSelect");
    const versionSelect = this.formContainer.getChildByID("versionSelect");

    // Check if both selections are made and enable the button
    [colorSelect, versionSelect].forEach(select => {
        select.addEventListener("change", () => {
            const colorSelected = colorSelect.value !== "";
            const versionSelected = versionSelect.value !== "";

            confirmBtn.disabled = !(colorSelected && versionSelected);
        });
    });
}

//////////////////////////////
//////////////////////////////
//////////////////////////////

createUI() {
    // Globals
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.padding = this.height * 0.04; // Padding between sections

    // **TOP BOX (Header UI)**
    let topBoxHeight = this.height * 0.15;
    let topBox = this.add.rectangle(this.width / 2, this.height * 0.1, this.width * 0.9, topBoxHeight, UI_STYLES.topBoxColor);
    topBox.setStrokeStyle(4, 0xffffff);
    this.add.text(this.width / 2, this.height * 0.1, "BIBLE DRILLS PRACTICE", {
        fontSize: UI_STYLES.fontSizeLarge,
        color: UI_STYLES.textColor
    }).setOrigin(0.5);

    // **MAIN BOX (Game Area)**
    this.mainBoxHeight = this.height - (topBox.y + topBoxHeight / 2) - this.padding;
    this.mainBox = this.add.rectangle(
        this.width / 2, 
        topBox.y + topBoxHeight / 2 + this.padding + this.mainBoxHeight / 2, 
        this.width * 0.9, 
        this.mainBoxHeight * 0.98, 
        UI_STYLES.mainBoxColor
    );
    this.mainBox.setStrokeStyle(4, 0xffffff);

    // **Main Content Container (Centers Everything)**
    this.contentContainer = this.add.container(this.width / 2, this.mainBox.y);

    // **Main Title Text**
    this.mainText = this.add.text(0, 0, "Choose Color and Version", {
        fontSize: UI_STYLES.fontSizeLarge,
        color: UI_STYLES.textColor
    }).setOrigin(0.5);

    // **Subtext (With Word Wrapping)**
    this.subText = this.add.text(0, 50, "Select a color and version to continue.", {
        fontSize: UI_STYLES.fontSizeMedium,
        color: UI_STYLES.textColor,
        wordWrap: { width: this.mainBox.width * 0.8, useAdvancedWrap: true },
        align: "center"
    }).setOrigin(0.5);

    // **Color and Version Labels (Bold & Underlined)**
    this.colorLabel = this.add.text(0, 120, "Color:", {
        fontSize: UI_STYLES.fontSizeMedium,
        fontStyle: "bold",
        color: "#ffffff"
    }).setOrigin(0.5);
    
    this.versionLabel = this.add.text(200, 120, "Version:", { // Move Version label to the right
        fontSize: UI_STYLES.fontSizeMedium,
        fontStyle: "bold",
        color: "#ffffff"
    }).setOrigin(0.5);

    // Underline effects
    let underlineColor = this.add.rectangle(0, 135, 50, 2, 0xffffff).setOrigin(0.5);
    let underlineVersion = this.add.rectangle(200, 135, 60, 2, 0xffffff).setOrigin(0.5);

    // **Selection Buttons**
    this.colorOptions = ["Blue", "Green", "Red"];
    this.versionOptions = ["KJV", "CSB"];
    this.selectedColor = null;
    this.selectedVersion = null;

    this.colorButtons = this.colorOptions.map((color, index) => {
        return this.add.text(-100, 160 + index * 30, color, {
            fontSize: UI_STYLES.fontSizeMedium,
            color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectColor(color));
    });

    this.versionButtons = this.versionOptions.map((version, index) => {
        return this.add.text(100, 160 + index * 30, version, {
            fontSize: UI_STYLES.fontSizeMedium,
            color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectVersion(version));
    });

    // **Add Elements to Container**
    this.contentContainer.add([
        this.mainText, this.subText, 
        this.colorLabel, this.versionLabel, 
        underlineColor, underlineVersion, 
        ...this.colorButtons, ...this.versionButtons
    ]);

    // **Adjust ContentContainer to Center Vertically**
    let totalHeight = 200; // Approximate total height of content
    this.contentContainer.y -= totalHeight / 2;


//////////////////////////////
//////////////////////////////
//////////////////////////////

createUI() {
    // Globals
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.padding = this.height * 0.04; // Padding between sections

    // **TOP BOX (Header UI)**
    let topBoxHeight = this.height * 0.15;
    let topBox = this.add.rectangle(this.width / 2, this.height * 0.1, this.width * 0.9, topBoxHeight, UI_STYLES.topBoxColor);
    topBox.setStrokeStyle(4, 0xffffff);
    this.add.text(this.width / 2, this.height * 0.1, "BIBLE DRILLS PRACTICE", {
        fontSize: UI_STYLES.fontSizeLarge,
        color: UI_STYLES.textColor
    }).setOrigin(0.5);

    // **MAIN BOX (Game Area)**
    this.mainBoxHeight = this.height - (topBox.y + topBoxHeight / 2) - this.padding;
    this.mainBox = this.add.rectangle(
        this.width / 2, 
        topBox.y + topBoxHeight / 2 + this.padding + this.mainBoxHeight / 2, 
        this.width * 0.9, 
        this.mainBoxHeight * 0.98, 
        UI_STYLES.mainBoxColor
    );
    this.mainBox.setStrokeStyle(4, 0xffffff);

    // **Main Box Text**
    this.centerY = this.mainBox.y;

    // Create a container for text elements
    this.contentContainer = this.add.container(this.width / 2, this.centerY);

    // Main title text
    this.mainText = this.add.text(0, 0, "", {
        fontSize: UI_STYLES.fontSizeLarge,
        color: UI_STYLES.textColor
    }).setOrigin(0.5);

    // Subtext description
    this.subText = this.add.text(0, 40, "", {
        fontSize: UI_STYLES.fontSizeMedium,
        color: UI_STYLES.textColor
    }).setOrigin(0.5);

    // Add text to the container
    this.contentContainer.add([this.mainText, this.subText]);

    // Center container vertically
    let totalHeight = this.subText.y + this.subText.height;
    this.contentContainer.y -= totalHeight / 2;

    // Selection Buttons (Hidden until Page 0)
    this.colorOptions = ["Blue", "Green", "Red"];
    this.versionOptions = ["KJV", "CSB"];
    this.selectedColor = null;
    this.selectedVersion = null;

    this.colorButtons = this.colorOptions.map((color, index) => {
        return this.add.text(this.width * 0.35, this.centerY + 50 + index * 40, color, {
            fontSize: UI_STYLES.fontSizeMedium,
            color: "#ffffff",
            backgroundColor: "#444"
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectColor(color));
    });

    this.versionButtons = this.versionOptions.map((version, index) => {
        return this.add.text(this.width * 0.65, this.centerY + 50 + index * 40, version, {
            fontSize: UI_STYLES.fontSizeMedium,
            color: "#ffffff",
            backgroundColor: "#444"
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectVersion(version));
    });

    // Navigation Buttons
    this.nextButton = this.add.text(this.width * 0.75, this.centerY + 120, "Next", {
        fontSize: UI_STYLES.fontSizeMedium,
        color: "#ffffff",
        backgroundColor: "#007bff",
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => this.nextPage());

    this.backButton = this.add.text(this.width * 0.25, this.centerY + 120, "Back", {
        fontSize: UI_STYLES.fontSizeMedium,
        color: "#ffffff",
        backgroundColor: "#ff0000",
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => this.prevPage());

    // Call setupPages AFTER UI is created
    this.setupPages();
}

setupPages() {
    this.setupPagesArray = [
        { main: "Choose Color and Version", sub: "Select a color and version to continue." },
        { main: "Choose Your Character", sub: "Select a character to begin." },
        { main: "Select Difficulty", sub: "Easy, Normal, or Hard?" },
        { main: "Confirm Choices", sub: "Are you ready to start?" }
    ];

    this.currentPage = 0;
    this.updatePage();
}

updatePage() {
    this.mainText.setText(this.setupPagesArray[this.currentPage].main);
    this.subText.setText(this.setupPagesArray[this.currentPage].sub);

    // Show color & version selectors on Page 0, hide otherwise
    let showSelectors = this.currentPage === 0;
    this.colorButtons.forEach(btn => btn.setVisible(showSelectors));
    this.versionButtons.forEach(btn => btn.setVisible(showSelectors));

    // Disable "Next" on Page 0 until selections are made
    if (this.currentPage === 0) {
        this.nextButton.setAlpha(this.selectedColor && this.selectedVersion ? 1 : 0.5);
    } else {
        this.nextButton.setAlpha(1);
    }
}

nextPage() {
    if (this.currentPage === 0 && (!this.selectedColor || !this.selectedVersion)) {
        return; // Prevent advancing if selection is not made
    }

    if (this.currentPage < this.setupPagesArray.length - 1) {
        this.currentPage++;
        this.updatePage();
    }
}

prevPage() {
    if (this.currentPage > 0) {
        this.currentPage--;
        this.updatePage();
    }
}

// Handle Color Selection
selectColor(color) {
    this.selectedColor = color;
    this.colorButtons.forEach(btn => {
        btn.setBackgroundColor(btn.text === color ? "#008000" : "#444"); // Highlight selected
    });

    this.updatePage(); // Enable "Next" button if both selections are made
}

// Handle Version Selection
selectVersion(version) {
    this.selectedVersion = version;
    this.versionButtons.forEach(btn => {
        btn.setBackgroundColor(btn.text === version ? "#008000" : "#444"); // Highlight selected
    });

    this.updatePage(); // Enable "Next" button if both selections are made
}

//////////////////////////////
//////////////////////////////
//////////////////////////////

To implement a "Choose Color and Version" page with a selector, you can create interactive buttons for color and version selection. The chosen values will be stored for use on later pages. Here's how you can do it:


---

1. Define Variables to Store Selections

These will hold the user's choices:

let selectedColor = null;
let selectedVersion = null;


---

2. Modify Setup Pages Array

We start with the color and version selection:

let setupPages = [
    { 
        main: "Choose Color and Version", 
        sub: "Select a Color and a Version to continue."
    },
    { main: "Character Selection", sub: "Choose your character." },
    { main: "Select Difficulty", sub: "Easy, Normal, or Hard?" },
    { main: "Confirm Choices", sub: "Are you ready to start?" }
];

let currentPage = 0;


---

3. Function to Update Page

This function updates content and shows the appropriate UI:

function updatePage() {
    mainText.setText(setupPages[currentPage].main);
    subText.setText(setupPages[currentPage].sub);

    // Hide selectors if not on first page
    colorButtons.forEach(button => button.setVisible(currentPage === 0));
    versionButtons.forEach(button => button.setVisible(currentPage === 0));

    // Disable "Next" unless a color and version are selected
    if (currentPage === 0) {
        nextButton.setAlpha(selectedColor && selectedVersion ? 1 : 0.5);
        nextButton.disableInteractive();
        if (selectedColor && selectedVersion) {
            nextButton.setInteractive();
        }
    }
}


---

4. Create Color & Version Selection Buttons

Buttons for selecting color and version:

// Colors: Blue, Green, Red
let colors = ["Blue", "Green", "Red"];
let colorButtons = colors.map((color, i) => {
    return this.add.text(width / 2 - 100 + i * 100, centerY + 20, color, {
        fontSize: UI_STYLES.fontSizeMedium,
        color: "#ffffff",
        backgroundColor: color.toLowerCase(),
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", function () {
        selectedColor = color;
        colorButtons.forEach(btn => btn.setStyle({ backgroundColor: btn.text.toLowerCase() }));
        this.setStyle({ backgroundColor: "#ffffff", color: "#000000" }); // Highlight selection
        updatePage();
    });
});

// Versions: KJV, CSB
let versions = ["KJV", "CSB"];
let versionButtons = versions.map((version, i) => {
    return this.add.text(width / 2 - 50 + i * 100, centerY + 60, version, {
        fontSize: UI_STYLES.fontSizeMedium,
        color: "#ffffff",
        backgroundColor: "#444444",
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", function () {
        selectedVersion = version;
        versionButtons.forEach(btn => btn.setStyle({ backgroundColor: "#444444" }));
        this.setStyle({ backgroundColor: "#ffffff", color: "#000000" }); // Highlight selection
        updatePage();
    });
});


---

5. Navigation Buttons

Buttons for moving through pages:

let nextButton = this.add.text(width * 0.75, centerY + 120, "Next", {
    fontSize: UI_STYLES.fontSizeMedium,
    color: "#ffffff",
    backgroundColor: "#007bff",
    padding: { left: 10, right: 10, top: 5, bottom: 5 }
})
.setOrigin(0.5)
.setInteractive()
.on("pointerdown", () => {
    if (currentPage === 0 && (!selectedColor || !selectedVersion)) return; // Block if nothing selected
    if (currentPage < setupPages.length - 1) {
        currentPage++;
        updatePage();
    }
});

let backButton = this.add.text(width * 0.25, centerY + 120, "Back", {
    fontSize: UI_STYLES.fontSizeMedium,
    color: "#ffffff",
    backgroundColor: "#ff0000",
    padding: { left: 10, right: 10, top: 5, bottom: 5 }
})
.setOrigin(0.5)
.setInteractive()
.on("pointerdown", () => {
    if (currentPage > 0) {
        currentPage--;
        updatePage();
    }
});


---

6. Initialize First Page

Call updatePage(); to start with the first page:

updatePage();


---

How It Works

The first page lets users select a color and version.

If a choice is made, it's highlighted and stored in selectedColor / selectedVersion.

The Next button stays disabled until both are selected.

Clicking "Next" moves to the next page, hiding the color/version selectors.


Would you like to store the selections in local storage so they persist between app sessions?


//////////////////////////////
//////////////////////////////
//////////////////////////////

To implement a multi-page setup where users can navigate forward and backward through a series of setup questions, you can maintain an array of pages and update the content dynamically based on the current page index.

Here's how you can structure it:

1. Define Your Pages

Store your setup questions as an array of objects:

let setupPages = [
    { main: "Welcome to the Game!", sub: "Press Next to continue." },
    { main: "Choose Your Character", sub: "Select a character to begin." },
    { main: "Select Difficulty", sub: "Easy, Normal, or Hard?" },
    { main: "Confirm Choices", sub: "Are you ready to start?" }
];

let currentPage = 0;

2. Function to Update Content

Modify the text based on the current page:

function updatePage() {
    mainText.setText(setupPages[currentPage].main);
    subText.setText(setupPages[currentPage].sub);
}

3. Navigation Buttons

Add "Next" and "Back" buttons:

let nextButton = this.add.text(width * 0.75, centerY + 80, "Next", {
    fontSize: UI_STYLES.fontSizeMedium,
    color: "#ffffff",
    backgroundColor: "#007bff",
    padding: { left: 10, right: 10, top: 5, bottom: 5 }
})
.setOrigin(0.5)
.setInteractive()
.on("pointerdown", () => {
    if (currentPage < setupPages.length - 1) {
        currentPage++;
        updatePage();
    }
});

let backButton = this.add.text(width * 0.25, centerY + 80, "Back", {
    fontSize: UI_STYLES.fontSizeMedium,
    color: "#ffffff",
    backgroundColor: "#ff0000",
    padding: { left: 10, right: 10, top: 5, bottom: 5 }
})
.setOrigin(0.5)
.setInteractive()
.on("pointerdown", () => {
    if (currentPage > 0) {
        currentPage--;
        updatePage();
    }
});

4. Initialize First Page

Call updatePage(); at the end of the setup to display the first question.


---

Now, users can click "Next" and "Back" to navigate through the setup process. Would you like to add any animations or transitions between pages?



//////////////////////////////
// **** CENTER OBJRCT INSIDE A RECTANGLE
//////////////////////////////

// **MAIN BOX (Game Area)**
let mainBoxHeight = height - (topBox.y + topBoxHeight / 2) - padding; // Max height after title + padding
let mainBox = this.add.rectangle(
    width / 2, 
    topBox.y + topBoxHeight / 2 + padding + mainBoxHeight / 2, 
            width * 0.9, 
            mainBoxHeight * 0.98, 
            UI_STYLES.mainBoxColor
        );
        mainBox.setStrokeStyle(4, 0xffffff);
        
        // **Main Box Text**

// Calculate the vertical center of mainBox
let centerY = mainBox.y; 

// Create a container centered inside mainBox
let contentContainer = this.add.container(width / 2, centerY);

// Create the main text (origin at center)
let mainText = this.add.text(0, 0, "Game Content", {
    fontSize: UI_STYLES.fontSizeLarge,
    color: UI_STYLES.textColor
}).setOrigin(0.5);

// Create the sub text (below main text)
let subText = this.add.text(0, 40, "Additional Info", {
    fontSize: UI_STYLES.fontSizeMedium,
    color: UI_STYLES.textColor
}).setOrigin(0.5);

// Add both to the container
contentContainer.add([mainText, subText]);

// Adjust container upwards so everything is truly centered
let totalHeight = subText.y + subText.height; // Total height of content
contentContainer.y -= totalHeight / 2;



//////////////////////////////
//////////////////////////////
//////////////////////////////

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
        this.topText = null; // Store text reference
    }

    create() {
        this.createUI();
        
        // Example: Update the text after 3 seconds
        this.time.delayedCall(3000, () => {
            this.updateTopText("New Title!");
        });
    }

    createUI() {
        const { width, height } = this.scale;

        // **TOP BOX (Header UI)**
        let topBox = this.add.rectangle(width / 2, height * 0.1, width * 0.9, height * 0.15, 0x1e3a5f);
        topBox.setStrokeStyle(4, 0xffffff);

        // Store text reference for updating later
        this.topText = this.add.text(width / 2, height * 0.1, "Game Title", {
            fontSize: "28px",
            color: "#ffffff"
        }).setOrigin(0.5);
    }

    updateTopText(newText) {
        if (this.topText) {
            this.topText.setText(newText);
        }
    }
}

// Phaser config
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene],
    parent: "game-container",
    backgroundColor: "#000000"
};

const game = new Phaser.Game(config);

//////////////////////////////
//////////////////////////////
//////////////////////////////

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
const MAX_WIDTH = 600; // Maximum width for mobile portrait
const ASPECT_RATIO = 16 / 9; // Standard portrait ratio (adjust if needed)

// Dynamically set height based on width
const gameWidth = Math.min(window.innerWidth, MAX_WIDTH);
const gameHeight = gameWidth * ASPECT_RATIO;

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: "game-container",
    scene: {
        preload: preload,
        create: create
    },
    scale: {
        mode: Phaser.Scale.FIT, // Ensure it fits the screen
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Initialize the game
const game = new Phaser.Game(config);

// Preload assets
function preload() {
    this.load.image("sky", "assets/sky.png"); // Example asset
}

// Create game objects

/*
function create() {
// Add sky image
    let sky = this.add.image(0, 0, "sky").setOrigin(0, 0); // Set origin to top-left

    // Scale width to match game width
    let scaleFactor = this.scale.width / sky.width;

    // Apply the scale while keeping the aspect ratio
    sky.setScale(scaleFactor);
*/

function create() {
    const { width, height } = this.scale;

    // **TOP BOX (Header UI)**
    let topBox = this.add.rectangle(width / 2, height * 0.1, width * 0.9, height * 0.15, 0x1e3a5f);
    topBox.setStrokeStyle(4, 0xffffff); // Add border
    this.add.text(width / 2, height * 0.1, "Game Title", {
        fontSize: "28px",
        color: "#ffffff"
    }).setOrigin(0.5);

    // **MAIN BOX (Game Area)**
    let mainBox = this.add.rectangle(width / 2, height * 0.5, width * 0.9, height * 0.55, 0x3a5a8f);
    mainBox.setStrokeStyle(4, 0xffffff); // Border
    this.add.text(width / 2, height * 0.5, "Game Content", {
        fontSize: "24px",
        color: "#ffffff"
    }).setOrigin(0.5);

    // **BOTTOM BOX (UI Section)**
    let bottomBox = this.add.rectangle(width / 2, height * 0.85, width * 0.9, height * 0.2, 0x1e3a5f);
    bottomBox.setStrokeStyle(4, 0xffffff);
    this.add.text(width / 2, height * 0.85, "Controls / Buttons", {
        fontSize: "20px",
        color: "#ffffff"
    }).setOrigin(0.5);

    // **Example: Button inside Bottom Box**
    let button = this.add.rectangle(width * 0.8, height * 0.85, 120, 50, 0xff5733)
        .setInteractive()
        .on("pointerdown", () => {
            console.log("Button Clicked!");
        });
    this.add.text(width * 0.8, height * 0.85, "Click Me", {
        fontSize: "18px",
        color: "#ffffff"
    }).setOrigin(0.5);

/*
    // Zooming and panning
    // Enable dragging (one-finger pan)
    this.input.on("pointermove", (pointer) => {
        if (pointer.isDown) {
            let panSpeed = 0.2; // Adjust this value (lower = slower panning)
            this.cameras.main.scrollX -= (pointer.velocity.x * panSpeed) / this.cameras.main.zoom;
            this.cameras.main.scrollY -= (pointer.velocity.y * panSpeed) / this.cameras.main.zoom;
        }
    });
    
    // Pinch zooming setup
    this.input.addPointer(2); // Enable multi-touch (two pointers)

    let initialDistance = 0;

    this.input.on("pointerdown", () => {
        if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
            initialDistance = Phaser.Math.Distance.Between(
                this.input.pointer1.x, this.input.pointer1.y,
                this.input.pointer2.x, this.input.pointer2.y
            );
        }
    });

    this.input.on("pointermove", () => {
        if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
            let newDistance = Phaser.Math.Distance.Between(
                this.input.pointer1.x, this.input.pointer1.y,
                this.input.pointer2.x, this.input.pointer2.y
            );

            let zoomFactor = newDistance / initialDistance;
            this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom * zoomFactor, 0.5, 3);
            initialDistance = newDistance;
        }
    });
*/
    // Set camera bounds to allow movement
    this.cameras.main.setBounds(0, 0, 1600, 1200); // Adjust as needed

}



// Game loop
function update() {
}

// Automatically sceoll to bottom
window.onload = function () {
    window.scrollTo(0, document.body.scrollHeight);
};
