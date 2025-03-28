const UI_STYLES = {
    // Box Colors
    topBoxColor: 0x2c3e50,
    mainBoxColor: 0x34495e,
    bottomBoxColor: 0x2c3e50,
    // Text Colors and Font Sizes
    textColor: "#ffffff",
    fontSizeLarge: "24px",
    fontSizeMedium: "20px",
    fontSizeSmall: "18px",
    // Button Color
    buttonColor: 0xe74c3c,
    // Optional: Background Color
    backgroundColor: 0x34495e,
};

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.createUI();
        this.createSelectionForm();  // Create the form using DOM elements
        this.setupPages();
    }

    createUI() {
        // Setting up the main UI components
        this.width = this.scale.width;
        this.height = this.scale.height;

        // **TOP BOX (Header UI)**
        let topBoxHeight = this.height * 0.15;
        let topBox = this.add.rectangle(this.width / 2, this.height * 0.1, this.width * 0.9, topBoxHeight, 0x0000ff);
        topBox.setStrokeStyle(4, 0xffffff);
        this.add.text(this.width / 2, this.height * 0.1, "BIBLE DRILLS PRACTICE", {
            fontSize: 30,
            color: "#ffffff"
        }).setOrigin(0.5);

        // **MAIN BOX (Game Area)**
        this.mainBoxHeight = this.height - (topBox.y + topBoxHeight / 2) - 50;
        this.mainBox = this.add.rectangle(
            this.width / 2, 
            topBox.y + topBoxHeight / 2 + 50 + this.mainBoxHeight / 2, 
            this.width * 0.9, 
            this.mainBoxHeight * 0.98, 
            0x333333
        );
        this.mainBox.setStrokeStyle(4, 0xffffff);
        
        // **Content Container for aligning text and buttons**
        this.centerY = this.mainBox.y;
        this.contentContainer = this.add.container(this.width / 2, this.centerY);
        
        // Create Title Text (Main Text)
        this.mainText = this.add.text(0, -180, "", {
            fontSize: 28,
            color: "#ffffff"
        }).setOrigin(0.5);
        
        // Create Subtext Description (Sub Text)
        this.subText = this.add.text(0, -80, "", {
            fontSize: 20,
            color: "#ffffff",
            wordWrap: { width: this.mainBox.width * 0.8, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);
        
        // Add both texts to the container
        this.contentContainer.add([this.mainText, this.subText]);
    }

    setupPages() {
        this.setupPagesArray = [
            { main: "Setup Color and Version", sub: "Select a color and version to continue." },
            { main: "Setup Call Type", sub: "Select a call type to begin." },
            { main: "Setup Drill Content", sub: "Select drill content." },
            { main: "Confirm Choices", sub: "Are you ready to start?" }
        ];
    
        this.currentPage = 0;
        this.updatePage();
    }
    
    updatePage() {
        this.mainText.setText(this.setupPagesArray[this.currentPage].main);
        this.subText.setText(this.setupPagesArray[this.currentPage].sub);
        
        if (this.currentPage === 1) {
            this.createSelectionForm2();
        } else if (this.currentPage === 2) {
            this.createSelectionForm3();
        }
    }

    nextPage() {
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

        if (this.currentPage === 0) {
            this.createSelectionForm();
        }
    }

    createSelectionForm() {
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

        const colorRadios = {
            Blue: this.formContainer.node.querySelector("#colorBlue"),
            Green: this.formContainer.node.querySelector("#colorGreen"),
            Red: this.formContainer.node.querySelector("#colorRed"),
        };
        const versionRadios = {
            KJV: this.formContainer.node.querySelector("#versionKJV"),
            CSB: this.formContainer.node.querySelector("#versionCSB"),
        };

        this.createSetupForm(
            this.formContainer,
            "confirmBtn", 
            colorRadios, 
            "selectedColor", 
            versionRadios, 
            "selectedVersion"
        );
    }

    createSetupForm(formContainer, a_button, a_option1, a_option1Sel, a_option2 = null, a_option2Sel = null) {
        const confirmBtn = formContainer.node.querySelector(`#${a_button}`);
    
        // Restore previous selections if available
        const storedOption1 = localStorage.getItem(a_option1Sel);
        const storedOption2 = a_option2Sel ? localStorage.getItem(a_option2Sel) : null;
    
        if (storedOption1 && a_option1[storedOption1]) {
            a_option1[storedOption1].checked = true;
        }
        if (a_option2 && storedOption2 && a_option2[storedOption2]) {
            a_option2[storedOption2].checked = true;
        }
    
        // Enable button if selections exist
        if (storedOption1 && (!a_option2Sel || storedOption2)) {
            confirmBtn.disabled = false;
        }
    
        const updateButtonState = () => {
            const option1Selected = Object.values(a_option1).some(r => r.checked);
            const option2Selected = a_option2 ? Object.values(a_option2).some(r => r.checked) : true; // If a_option2 is null, treat it as selected
            confirmBtn.disabled = !(option1Selected && option2Selected);
        };
    
        [...Object.values(a_option1), ...(a_option2 ? Object.values(a_option2) : [])].forEach(radio => {
            radio.addEventListener("change", updateButtonState);
        });
    
        confirmBtn.addEventListener("click", () => {
            localStorage.setItem(a_option1Sel, Object.keys(a_option1).find(c => a_option1[c].checked));
            if (a_option2 && a_option2Sel) {
                localStorage.setItem(a_option2Sel, Object.keys(a_option2).find(v => a_option2[v].checked));
            }
            this.startNextPage();
        });
    }

// BEFORE FUNCTION
/*
    createSelectionForm() {
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
*/
// BEFORE FUNCTION

    createSelectionForm2() {
        // Create the form container using Phaser DOM (add.dom())
        this.formContainer = this.add.dom(this.width / 2, this.centerY + 100).createFromHTML(`
            <div style="text-align: center; font-family: Arial; color: #ffffff;">
                <div>
                    <strong>Call Type::</strong><br>
                    <input type="radio" id="compCall" name="call" value="Completion Call">
                        <label for="compCall">Completion Call</label><br>
                    <input type="radio" id="quotCall" name="call" value="Quotation Call">
                        <label for="quotCall">Quotation Call</label><br>
                    <input type="radio" id="keypCall" name="call" value="Key Passages Call">
                        <label for="keypCall">Key Passages</label><br>
                    <input type="radio" id="bookCall" name="call" value="Book Call">
                        <label for="bookCall">Book Call</label><br>
                </div>
               <br><br>
                <button id="backBtn">Back</button>
                <button id="confirmBtn" disabled>Continue</button>
            </div>
        `);
        
        // Use Phaser's dom element to set up the button interaction
        const confirmBtn = this.formContainer.getChildByID("confirmBtn");

        // Set up the event listener for the "Continue" button
        confirmBtn.addEventListener("click", () => {
            const callTypeRadios = this.formContainer.getChildByID("compCall").checked
                ? "Completion Call"
                : this.formContainer.getChildByID("quotCall").checked
                ? "Quotation Call"
                : this.formContainer.getChildByID("keypCall").checked
                ? "Key Passages Call"
                : "Book Call";
    
            this.selectedCallType = callTypeRadios;

            // Proceed to the next page or action
            this.startNextPage();
        });
        
        // Add an event listener to update the button state based on selections
        const callTypeRadios = [
            this.formContainer.getChildByID("compCall"),
            this.formContainer.getChildByID("quotCall"),
            this.formContainer.getChildByID("keypCall"),
            this.formContainer.getChildByID("bookCall")
        ];
        
        // Check if both selections are made and enable the button
        [...callTypeRadios].forEach(radio => {
            radio.addEventListener("change", () => {
                const callTypeSelected = callTypeRadios.some(r => r.checked);

                confirmBtn.disabled = !(callTypeSelected);
            });
        });
        
        const backBtn = this.formContainer.getChildByID("backBtn");
        
        // Set up the event listener for the "Continue" button
        backBtn.addEventListener("click", () => {
            this.startPrevioudPage();
        });
        //
    }

    createSelectionForm3() {
        // Create the form container using Phaser DOM (add.dom())
        this.formContainer = this.add.dom(this.width / 2, this.centerY + 100).createFromHTML(`
            <div style="text-align: center; font-family: Arial; color: #ffffff;">
                <div>
                    <strong>Setup Drill Content:</strong><br>
                    <input type="radio" id="compCall" name="call" value="Completion Call">
                        <label for="compCall">Completion Call</label><br>
                    <input type="radio" id="quotCall" name="call" value="Quotation Call">
                        <label for="quotCall">Quotation Call</label><br>
                    <input type="radio" id="keypCall" name="call" value="Key Passages Call">
                        <label for="keypCall">Key Passages</label><br>
                    <input type="radio" id="bookCall" name="call" value="Book Call">
                        <label for="bookCall">Book Call</label><br>
                </div>
               <br><br>
                <button id="confirmBtn" disabled>Continue</button>
            </div>
        `);
        
        //
    }

    // Function to transition to the next page or scene
    startNextPage() {
        if (this.selectedCallType) {
            console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion") + " Call Type: " + this.selectedCallType);
        } else {
            console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion"));
        }
        this.formContainer.destroy(); // Ckear form after confirming
        this.nextPage();
    }

    // Function to transition to the previous page or scene
    startPrevioudPage() {
        this.formContainer.destroy(); // Ckear form after confirming
        this.prevPage();
    }
}



/*
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" }); // Scene key for reference
    }

    create() {
        this.createUI();
        this.setupPages();

    }

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
            this.backButton.setVisible(false);
        } else {
            this.nextButton.setAlpha(1);
            this.backButton.setVisible(true);
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
            btn.setBackgroundColor(btn.text === color ? "#008000" : this.backgroundColor ); // Highlight selected
        });
    
        this.updatePage(); // Enable "Next" button if both selections are made
    }
    
    // Handle Version Selection
    selectVersion(version) {
        this.selectedVersion = version;
        this.versionButtons.forEach(btn => {
            btn.setBackgroundColor(btn.text === version ? "#008000" : this.backgroundColor); // Highlight selected
        });
    
        this.updatePage(); // Enable "Next" button if both selections are made
    }
}
*/

// Export if using modules
//export default MainScene;
export default MainScene;