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
            { main: "Setup Drill Content", sub: "Select drill content to include." },
            { main: "Select Custom Content", sub: "Select the content you would like to practice with." },
            { main: "Drill Practice", sub: "Let's practice!" },
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
        } else if (this.currentPage === 3 && localStorage.getItem("selectedContent") === 'All') {
            this.nextPage();
            this.drillStart();
        }
    }

    nextPage() {
        
        // Storage logs
        if (localStorage.getItem("selectedCompletionCall") && !localStorage.getItem("selectedContent")) {
            console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion") + " Call Type: " + localStorage.getItem("selectedCompletionCall"));
        } else if (localStorage.getItem("selectedContent")) {
            console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion") + " Call Type: " + localStorage.getItem("selectedCompletionCall") + " Content: " + localStorage.getItem("selectedContent"));
        } else {
            console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion"));
        }
        
        if (this.currentPage < this.setupPagesArray.length - 1) {
            this.formContainer.destroy(); // Ckear form
            this.currentPage++;
            this.updatePage();
        }
    }
    
    prevPage() {
        if (this.currentPage > 0) {
            this.formContainer.destroy(); // Ckear form
            this.currentPage--;
            this.updatePage();
        }

        if (this.currentPage === 0) {
            this.createSelectionForm();
        }
    }

    drillStart() {
        console.log('drill started...');
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

    createSetupForm(formContainer, a_button, a_option1, a_option1Sel, a_option2 = null, a_option2Sel = null, backBtn = null) {
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
    
        if (backBtn) {
            const backBtn = this.formContainer.getChildByID("backBtn");
        
            // Set up the event listener for the "Back" button
            backBtn.addEventListener("click", () => {
                this.prevPage();
            });
        }
    
        confirmBtn.addEventListener("click", () => {
            localStorage.setItem(a_option1Sel, Object.keys(a_option1).find(c => a_option1[c].checked));
            if (a_option2 && a_option2Sel) {
                localStorage.setItem(a_option2Sel, Object.keys(a_option2).find(v => a_option2[v].checked));
            }
            this.nextPage();
        });
    }

    createSelectionForm2() {
        // Create the form container using Phaser DOM (add.dom())
        this.formContainer = this.add.dom(this.width / 2, this.centerY + 100).createFromHTML(`
            <div style="text-align: center; font-family: Arial; color: #ffffff;">
                <div>
                    <strong>Call Type:</strong><br>
                    <input type="radio" id="compCall" name="call" value="Completion Call">
                        <label for="compCall">Completion Call</label><br>
                    <input type="radio" id="quotCall" name="call" value="Quotation Call">
                        <label for="quotCall">Quotation Call</label><br>
                    <input type="radio" id="keypCall" name="call" value="Key Passages Call">
                        <label for="keypCall">Key Passages Call</label><br>
                    <input type="radio" id="bookCall" name="call" value="Book Call">
                        <label for="bookCall">Book Call</label><br>
                </div>
               <br><br>
                <button id="backBtn">Back</button>
                <button id="confirmBtn" disabled>Continue</button>
            </div>
        `);

        const compRadios = {
            CompletionCall: this.formContainer.node.querySelector("#compCall"),
            QuotationCall: this.formContainer.node.querySelector("#quotCall"),
            KeyPassagesCall: this.formContainer.node.querySelector("#keypCall"),
            BookCall: this.formContainer.node.querySelector("#bookCall"),
        };

        this.createSetupForm(
            this.formContainer,
            "confirmBtn", 
            compRadios, 
            "selectedCompletionCall", 
            null, 
            null,
            "backBtn" // ? Back button
        );
    }

    createSelectionForm3() {
        // Create the form container using Phaser DOM (add.dom())
        this.formContainer = this.add.dom(this.width / 2, this.centerY + 100).createFromHTML(`
            <div style="text-align: center; font-family: Arial; color: #ffffff;">
                <div>
                    <strong>Included Content:</strong><br>
                    <input type="radio" id="contentAll" name="content" value="All">
                        <label for="contentAll">All</label><br>
                    <input type="radio" id="contentCustom" name="content" value="Custom (choose)">
                        <label for="contentCustom">Custom (choose)</label><br>
                </div>
               <br><br>
               <button id="backBtn">Back</button>
               <button id="confirmBtn" disabled>Continue</button>
            </div>
        `);

        const contentRadios = {
            All: this.formContainer.node.querySelector("#contentAll"),
            customChoose: this.formContainer.node.querySelector("#contentCustom"),
        };

        this.createSetupForm(
            this.formContainer,
            "confirmBtn", 
            contentRadios, 
            "selectedContent", 
            null, 
            null,
            "backBtn"
        );
    }
}

// Export default MainScene;
export default MainScene;