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
        this.filteredVerses = []
    }

    preload() {
        this.load.json('bibleVerses', 'assets/bibleVerses.json');
        this.load.json('keyPassages', 'assets/keyPassages.json');
        this.load.json('bibleBooks', 'assets/bibleBooks.json');
    }

    create() {
        this.createUI();
        this.createSelectionForm();  // Create the form using DOM elements
        this.setupPages();
    }

    updateEditIcons() {
        // Re-fetch stored values
        const selectedColor = localStorage.getItem('selectedColor');
        const selectedVersion = localStorage.getItem('selectedVersion');
        let selectedCall = localStorage.getItem('selectedCall');
        const selectedContent = localStorage.getItem('selectedContent');
    
        // Update visibility based on stored values
        this.editColorIcon.setVisible(!!selectedColor);
        this.colorText_val.setText(selectedColor);
        this.editVersionIcon.setVisible(!!selectedVersion);
        this.versionText_val.setText(selectedVersion);
        this.editCallIcon.setVisible(!!selectedCall);
//// WIP Modify strings
        if (selectedCall === 'CompletionCall') {
            selectedCall = 'Completion';
        }
        this.callType_val.setText(selectedCall);
        this.editContentIcon.setVisible(!!selectedContent);
        this.contentType_val.setText(selectedContent);
    }

    createUI() {
        // Setting up the main UI components
        this.width = this.scale.width;
        this.height = this.scale.height;

        // **TOP BOX (Header UI)**
        let topBox = this.add.rectangle(this.width / 2, this.height / 6, this.width * 0.9, this.height * 0.3, 0x0000ff);
        topBox.setStrokeStyle(4, 0xffffff);
        this.add.text(this.width / 2, this.height * 0.09, "BIBLE DRILLS PRACTICE", {
            fontSize: 24,
            color: "#ffffff"
        }).setOrigin(0.5);
        
        // **TOP BOX (Selected options)
        let topBoxWidth = this.width * 0.9;
        let topBoxHeight = 90;
        let topBoxX = this.width / 2;
        let topBoxY = this.height / 3 - 70;
        
        let topBoxOptions = this.add.rectangle(topBoxX, topBoxY, topBoxWidth, topBoxHeight, 0x8c0f0f);
        topBoxOptions.setStrokeStyle(4, 0xffffff);
        
        // Add text labels (offset so they appear inside the box)
        let colorText = this.add.text(topBoxX - 120, topBoxY - 30, 'Color: ', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        this.colorText_val = this.add.text(topBoxX - 80, topBoxY - 30, 'NA', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        let versionText = this.add.text(topBoxX - 120, topBoxY - 10, 'Version: ', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        this.versionText_val = this.add.text(topBoxX - 65, topBoxY - 10, 'NA', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        let callType = this.add.text(topBoxX + 10, topBoxY - 30, 'Call Type: ', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        this.callType_val = this.add.text(topBoxX + 75, topBoxY - 30, 'NA', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        let contentType = this.add.text(topBoxX + 10, topBoxY - 10, 'Content: ', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        this.contentType_val = this.add.text(topBoxX + 68, topBoxY - 10, 'NA', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        // Retrieve stored values
        const selectedColor = localStorage.getItem('selectedColor');
        const selectedVersion = localStorage.getItem('selectedVersion');
        const selectedCall = localStorage.getItem('selectedCall');
        const selectedContent = localStorage.getItem('selectedContent');
        
        // Function to create an edit icon if the corresponding value is available
        this.createEditIcon = (x, y, key, callback) => {
            if (!key) return null; // Only create the icon if the value exists
        
            let editIcon = this.add.text(x, y, '[ EDIT ]', {
                fontSize: '10px',
                fill: '#ffff00',
                fontFamily: 'Arial'
            }).setInteractive();
        
            editIcon.on('pointerdown', callback);
            return editIcon;
        }
    
        // Create edit icons
        this.editColorIcon = this.createEditIcon(topBoxX - 155, topBoxY - 30, 'selectedColor', () => {
            console.log('Edit Color clicked');
        });
    
        this.editVersionIcon = this.createEditIcon(topBoxX - 155, topBoxY - 10, 'selectedVersion', () => {
            console.log('Edit Version clicked');
        });
    
        this.editCallIcon = this.createEditIcon(topBoxX - 25, topBoxY - 30, 'selectedCall', () => {
            console.log('Edit Call clicked');
        });
    
        this.editContentIcon = this.createEditIcon(topBoxX - 25, topBoxY - 10, 'selectedContent', () => {
            console.log('Edit Content clicked');
        });
    
        // Update visibility of icons
        this.updateEditIcons();

        // **MAIN BOX (Game Area)**
        this.mainBoxHeight = this.height / 1.5;
        this.mainBox = this.add.rectangle(
            this.width / 2, 
            this.mainBoxHeight - 15, 
            this.width * 0.9, 
            this.mainBoxHeight + 25, 
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
        } else if (this.currentPage === 3 && localStorage.getItem("selectedContent") === 'customChoose') {
            this.drillStart();
        }
    }

    nextPage() {
        // Storage logs
        if (localStorage.getItem("selectedCall") && !localStorage.getItem("selectedContent")) {
            //console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion") + " Call Type: " + localStorage.getItem("selectedCall"));
        } else if (localStorage.getItem("selectedContent")) {
            //console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion") + " Call Type: " + localStorage.getItem("selectedCall") + " Content: " + localStorage.getItem("selectedContent"));
        } else {
            //console.log("next Color: " + localStorage.getItem("selectedColor") + " Version: " + localStorage.getItem("selectedVersion"));
        }
        
        if (this.currentPage < this.setupPagesArray.length - 1) {
            this.formContainer.destroy(); // Ckear form
            this.currentPage++;
            this.updateEditIcons();
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

    selectedOptionsBar() {
        
    }

    doDrills(arrayType = []) {
        // Set all & custom arrays to 'filteredVerses'
        this.filteredVerses = arrayType;

        console.log("Array Used:" + JSON.stringify(this.filteredVerses)); // Debug output

        //// Use and move or clear?
        this.mainText.setText("");
        this.subText.setText("");
        const customForm = document.getElementById('customForm');
        if (customForm) customForm.remove();

        const selectedCall = localStorage.getItem('selectedCall');
        let drillString = [];
        this.filteredVerses.forEach(item => {
            if (selectedCall === 'CompletionCall') {
                drillString.push({
                    type: 'CompletionCall',
                    drill: `<strong><u>${item.verse_ul}</u></strong>`,
                    ans: `${item.verse}<br><strong>${item.ref}</strong>`
                });
            } else if (selectedCall === 'QuotationCall') {
                drillString.push({
                    drill: `${item.ref}`,
                    ans: `${item.verse_ul}${item.verse}`
                });
            } else if (selectedCall === 'KeyPassagesCall') {
                drillString.push({
                    drill: `${item.name}`,
                    ans: `<strong>${item.ref}</strong>`
                });
            } else {
                drillString.push({
                    drill: `${item.book}`,
                    ans: `${item.ba}`
                });
            }
        });
        
        this.drillContainer = this.add.dom(this.width / 4, this.height / 3).createFromHTML(`
                <button id="prevDrill" style="visibility: hidden;">Previous</button>
                <button id="nextDrill">Next</button>
                <div id="drillContent"></div>
                <div id="drillAnswer"></div>
                <button id="answerDrill">See Answer</button>
        `);
        this.drillContainer.node.style.color = 'white';
        this.drillContainer.node.style.width = '80%';
        
        // Drill navigation logic
        let currentDrillIndex = 0;  // Start with the first drill
        
        // Function to update the drill display
        function updateDrillDisplay() {
            let currentDrill = drillString[currentDrillIndex];
            let drillContent = currentDrill.drill;
            let drillAnswer = currentDrill.ans;
        
            // Update content display
            document.getElementById('drillContent').innerHTML = drillContent;
            document.getElementById('drillAnswer').innerHTML = '';  // Clear previous answer
            document.getElementById('answerDrill').style.visibility = 'visible';  // Show the answer button
        
            // Show the correct drill navigation buttons
            document.getElementById('prevDrill').style.visibility = (currentDrillIndex === 0) ? 'hidden' : 'visible';
            document.getElementById('nextDrill').style.visibility = (currentDrillIndex === drillString.length - 1) ? 'hidden' : 'visible';
        }
        
        // Move to the next drill
        function moveToNextDrill() {
            if (currentDrillIndex < drillString.length - 1) {
                currentDrillIndex++;
                updateDrillDisplay();
            }
        }
        
        // Move to the previous drill
        function moveToPreviousDrill() {
            if (currentDrillIndex > 0) {
                currentDrillIndex--;
                updateDrillDisplay();
            }
        }
        
        // Answer reveal functionality
        document.getElementById('answerDrill').addEventListener('click', () => {
            let currentDrill = drillString[currentDrillIndex];
            if (selectedCall === 'CompletionCall') {
                document.getElementById('drillContent').innerHTML = currentDrill.drill + currentDrill.ans;
            } else {
                document.getElementById('drillAnswer').innerHTML = currentDrill.ans;
            }
            document.getElementById('answerDrill').style.visibility = 'hidden';  // Hide answer button
        });
        
        // Button navigation
        document.getElementById('nextDrill').addEventListener('click', moveToNextDrill);
        document.getElementById('prevDrill').addEventListener('click', moveToPreviousDrill);
        
        // Initialize the first drill
        updateDrillDisplay();
    }

    drillStart() {
        // Organize array data
        this.setupArrays();
        
        if (localStorage.getItem("selectedContent") === 'All') {
           this.doDrills(this.filteredVerses);
        } else {
            // Create container for the form
            this.drillContainer = this.add.dom(this.width / 2, this.centerY + 100).createFromHTML(`
                <div id="customForm" style="
                    text-align: center;
                    font-family: Arial;
                    color: #ffffff;
                    padding: 15px;
                    border-radius: 10px;
                    width: 250px;">
                    
                    <div id="verseSelectionContainer" 
                         style="text-align: left; display: inline-block; 
                                max-height: 200px; overflow-y: auto; width: 100%;
                                border: 1px solid #ffffff; padding: 10px; border-radius: 5px;">
                        ${this.filteredVerses.map((verse, index) => {
                            // Determine what to display based on object structure
                            let displayText = verse.name || verse.verse_ul || verse.book;
                            if (verse.verse_ul) {
                                displayText = `${index+1}. ${verse.verse_ul}${verse.verse}<br>(${verse.ref})`;
                            }
                            let idValue = encodeURIComponent(verse.name || verse.verse_ul || verse.book); // Ensure unique IDs
            
                            return `
                                <div id="container_${idValue}" class="verse-container" 
                                     data-id="${idValue}" style="display: flex; align-items: center; 
                                     margin-bottom: 5px; border: 1px solid white; background-color: black; 
                                     padding: 5px; cursor: pointer;">
                                    ${displayText}
                                </div>
                                `;
                        }).join('')}
                    </div>
            
                    <button id="submitSelection" style="
                        margin-top: 10px; background: #e74c3c; color: #ffffff; 
                        border: none; padding: 8px 15px; border-radius: 5px;
                        cursor: pointer; font-size: 14px;">
                        Save Selection
                    </button>
                </div>
            `);
            
            // Store reference to 'this' outside the event listener
            const self = this; // Preserve reference to the class instance
            
            setTimeout(() => {
                document.querySelectorAll('.verse-container').forEach(container => {
                    container.addEventListener('click', function() {
                        const verseId = this.dataset.id;
                        const verse = self.filteredVerses.find(v => encodeURIComponent(v.name || v.verse_ul || v.book) === verseId);
                        
                        if (verse) {
                            // Toggle selection
                            const isSelected = this.classList.toggle('selected');
                            this.style.backgroundColor = isSelected ? 'green' : 'black';
            
                            // Ensure self.customArray is initialized
                            if (!self.customArray) self.customArray = [];
            
                            // Update selection array
                            if (isSelected) {
                                self.customArray.push(verse);
                            } else {
                                self.customArray = self.customArray.filter(v => v !== verse);
                            }
                        }
                    });
                });
            }, 0);
            
            // Handle selection update
            document.getElementById('submitSelection').addEventListener('click', () => {
                this.updateCustomArray();
            });
        }
    }

    updateCustomArray() {
        this.customArray = []; // Reset selection
        
        document.querySelectorAll('.verse-container.selected').forEach(container => {
            const verseId = container.dataset.id;
            const verse = this.filteredVerses.find(v => encodeURIComponent(v.name || v.verse_ul || v.book) === verseId);
            
            if (verse) {
                this.customArray.push(verse);
            }
        });
    
        this.doDrills(this.customArray);
    }

    setupArrays() {
        const bibleVerses = this.cache.json.get('bibleVerses');
        const keyPassages = this.cache.json.get('keyPassages');
        const bibleBooks = this.cache.json.get('bibleBooks');

        const selectedColor = localStorage.getItem('selectedColor');
        const selectedVersion = localStorage.getItem('selectedVersion');
        const selectedCall = localStorage.getItem('selectedCall');
        const selectedContent = localStorage.getItem('selectedContent');
        
        if (selectedCall === 'CompletionCall' || selectedCall === 'QuotationCall') {
            this.filteredVerses = bibleVerses.filter(i => i.color === selectedColor.toLowerCase() && i.vers === selectedVersion.toLowerCase());
        } else if (selectedCall === 'KeyPassagesCall') {
            this.filteredVerses = keyPassages.filter(i => i.color === selectedColor.toLowerCase());
        } else {
            this.filteredVerses = bibleBooks;
        }
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
            "selectedCall", 
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