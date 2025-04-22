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

class CountdownTimer {
    constructor(containerId, totalTime) {
        this.container = document.getElementById(containerId);
        this.totalTime = totalTime;
        this.remainingTime = totalTime;
        this.blocks = [];
        this.interval = null;
        this.timeIsUp = false;
        this.createUI();
    }

    createUI() {
        this.container.innerHTML = ''; // Clear previous content
        this.blocks = [];

        // Wrapper for styling
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('timer-wrapper');

        // Progress Bar Container
        this.progressBar = document.createElement('div');
        this.progressBar.classList.add('progress-bar');
        this.progressBar.style.visibility = 'hidden'; // Initially hidden

        // Create blocks for countdown
        this.displayBlocks = this.totalTime;

        for (let i = 0; i < this.displayBlocks; i++) {
            let block = document.createElement('div');
            block.classList.add('block');
            block.style.visibility = 'hidden'; // Initially hidden
            block.style.backgroundColor = 'lightgreen';
            block.style.width = `${100 / this.displayBlocks}%`;
            this.blocks.push(block);
            this.progressBar.appendChild(block);
        }

        // Status Text
        this.statusText = document.createElement('div');
        this.statusText.classList.add('status-text');
        this.statusText.textContent = 'READY';

        // Buttons Container
        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('button-container');

        // Start Button
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Start';
        this.startButton.addEventListener('click', () => this.start());

        // Reset Button
        this.resetButton = document.createElement('button');
        this.resetButton.textContent = 'Reset';
        this.resetButton.addEventListener('click', () => this.reset());

        // Append buttons to button container
        this.buttonContainer.appendChild(this.startButton);
        this.buttonContainer.appendChild(this.resetButton);

        // Append elements to wrapper
        this.wrapper.appendChild(this.progressBar);
        this.wrapper.appendChild(this.statusText);
        this.wrapper.appendChild(this.buttonContainer);
        this.container.appendChild(this.wrapper);
    }

    start() {
        if (this.interval) return; // Prevent multiple intervals

        if (this.timeIsUp) {
            // Reset state if restarting
            this.timeIsUp = false;
            this.remainingTime = this.totalTime;
            this.blocks.forEach(block => {
                block.style.visibility = 'visible';
                block.style.backgroundColor = 'lightgreen';
            });
        }

        // Show the progress bar when starting
        this.progressBar.style.visibility = 'visible';
        this.blocks.forEach(block => block.style.visibility = 'visible');

        this.statusText.textContent = this.remainingTime; // Set initial countdown display

        this.interval = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;

                let blockIndex = this.totalTime - this.remainingTime - 1;

                // Remove blocks from **RIGHT to LEFT**
                if (blockIndex < this.blocks.length) {
                    let reverseIndex = this.blocks.length - 1 - blockIndex;
                    this.blocks[reverseIndex].style.visibility = 'hidden';
                }

                // Calculate percentage remaining
                let percentage = (this.remainingTime / this.totalTime) * 100;

                // Change colors based on percentage
                let color = percentage <= 20 ? 'red' :
                            percentage <= 40 ? 'yellow' : 'lightgreen';

                // Apply color change to visible blocks
                this.blocks.forEach(block => {
                    if (block.style.visibility === 'visible') {
                        block.style.backgroundColor = color;
                    }
                });

                this.statusText.textContent = this.remainingTime > 0 ? this.remainingTime : 'TIME IS UP!';
            } else {
                this.stop();
                this.timeIsUp = true;
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    reset() {
        this.stop();
        this.remainingTime = this.totalTime;
        this.timeIsUp = false;
        this.createUI();
        this.statusText.textContent = 'READY';
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.filteredVerses = [];
    }

    preload() {
        this.load.json('bibleVerses', 'bibleVerses.json');
        this.load.json('keyPassages', 'keyPassages.json');
        this.load.json('bibleBooks', 'bibleBooks.json');
    }

    create() {
        this.createUI();
        this.createSelectionForm();  // Create the form using DOM elements
        this.setupPages();

        // customArray, allArray
        const selectedColor = localStorage.getItem('selectedColor');
        const selectedVersion = localStorage.getItem('selectedVersion');
        const selectedCall = localStorage.getItem('selectedCall');
        const selectedContent = localStorage.getItem('selectedContent');
        let savedData = !!(selectedColor && selectedVersion && selectedCall && selectedContent);
        if (savedData) {
            if (this.formContainer) this.formContainer.destroy();
            // Retrieve 'all' data
            const retrievedAllArray = JSON.parse(localStorage.getItem("allArray")) || [];
            // Retrieve 'custom' data
            const retrievedCustomArray = JSON.parse(localStorage.getItem("customArray")) || [];
            if (retrievedAllArray.length > 0 && selectedContent === 'All') {
                this.doDrills(retrievedAllArray);
                this.updateSelections();
                this.setEditIcons();
            } else if (retrievedCustomArray.length > 0 && selectedContent === 'customChoose') {
                this.doDrills(retrievedCustomArray);
                this.updateSelections(retrievedCustomArray);
                this.setEditIcons();
            }
        }
    }

    updateSelections(currentArray = []) {
        // Re-fetch stored values
        const selectedColor = localStorage.getItem('selectedColor');
        const selectedVersion = localStorage.getItem('selectedVersion');
        const selectedCall = localStorage.getItem('selectedCall');
        const selectedContent = localStorage.getItem('selectedContent');
    
        // Update values based on stored values
        this.colorText_val.setText(selectedColor);
        this.versionText_val.setText(selectedVersion);
        if (selectedContent === 'customChoose') {
            if (currentArray.length > 0) {
                this.contentType_val.setText('Custom (' + currentArray.length + ')');
            }
        } else {
            // 'All'
            this.contentType_val.setText(selectedContent);
        }

        // Modify strings for output
        let selectedCallString = null;
        if (selectedCall) {
            selectedCallString = selectedCall.replace(/([A-Z])/g, ' $1').trim();
            this.callType_val.setText(selectedCallString);
        } else {
            this.callType_val.setText(selectedCall);
        }
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

        // **MAIN BOX (Game Area)**
        this.mainBox = this.add.rectangle(
            this.width / 2, 
            this.height / 1.63, 
            this.width * 0.9, 
            this.height / 1.3, 
            0x333333
        );
        this.mainBox.setStrokeStyle(4, 0xffffff);
        
        // **Content Container for aligning text and buttons**
        this.centerY = this.mainBox.y;
        this.contentContainer = this.add.container(this.width / 2, this.centerY);
        
        // Create Title Text (Main Text)
        this.mainText = this.add.text(0, -120, "", {
            fontSize: 28,
            color: "#ffffff"
        }).setOrigin(0.5);
        
        // Create Subtext Description (Sub Text)
        this.subText = this.add.text(0, -40, "", {
            fontSize: 20,
            color: "#ffffff",
            wordWrap: { width: this.mainBox.width * 0.8, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);
        
        // Add both texts to the container
        this.contentContainer.add([this.mainText, this.subText]);

        // **TOP BOX (Selected options)
        let optionsBoxWidth = this.width * 0.9;
        let optionsBoxHeight = this.height * 0.18;
        let optionsBoxX = this.width / 2;
        let optionsBoxY = this.height * 0.27;

        // **CREATE A CONTAINER TO HOLD EVERYTHING**
        this.optionsContainer = this.add.container(optionsBoxX, optionsBoxY);

        // **CREATE THE BACKGROUND RECTANGLE**
        let topBoxOptions = this.add.rectangle(
            0, 0, // Use (0,0) since container handles positioning
            optionsBoxWidth, optionsBoxHeight,
            0x8c0f0f
        );
        topBoxOptions.setStrokeStyle(4, 0xffffff);

        // **DYNAMIC TEXT POSITIONS (RELATIVE TO THE CONTAINER)**
        let baseX = -optionsBoxWidth / 2.8; // Start from left
        let textY = -optionsBoxHeight / 3;

        let fontSize = Math.max(16, this.width * 0.025); // Scale font size dynamically

        // **Text val Position - 1 character space (~10px)**
        let spacing = 10; 

        this.colorText = this.add.text(baseX, textY, 'Color:', { fontSize, fill: '#ffffff' });
        this.colorText_val = this.add.text(this.colorText.x + this.colorText.width + spacing, textY, 'NA', { fontSize, fill: '#ffffff' });

        let versionText = this.add.text(this.colorText.width / 1.5, textY, 'Version:', { fontSize, fill: '#ffffff' });
        this.versionText_val = this.add.text(versionText.x + versionText.width + spacing, textY, 'NA', { fontSize, fill: '#ffffff' });

        this.callType = this.add.text(baseX, textY + 30, 'Call Type:', { fontSize, fill: '#ffffff' });
        this.callType_val = this.add.text(this.callType.x + this.callType.width + spacing, textY + 30, 'NA', { fontSize, fill: '#ffffff' });

        this.contentType = this.add.text(baseX, textY + 60, 'Content:', { fontSize, fill: '#ffffff' });
        this.contentType_val = this.add.text(this.contentType.x + this.contentType.width + spacing, textY + 60, 'NA', { fontSize, fill: '#ffffff' });

        // **ADD EVERYTHING TO THE CONTAINER**
        this.optionsContainer.add([
            topBoxOptions, // Add the background first
            this.colorText, this.colorText_val,
            versionText, this.versionText_val,
            this.callType, this.callType_val,
            this.contentType, this.contentType_val
        ]);

        // **Ensure Proper Depth (Text on Top)**
        topBoxOptions.setDepth(0);
        this.colorText.setDepth(1);
        this.colorText_val.setDepth(1);
        versionText.setDepth(1);
        this.versionText_val.setDepth(1);
        this.callType.setDepth(1);
        this.callType_val.setDepth(1);
        this.contentType.setDepth(1);
        this.contentType_val.setDepth(1);
    }

    setEditIcons() {
        
        if (this.editColorIcon && this.editCallIcon && this.editContentIcon) return;
        
        let topBoxX = this.width / 2;
        let topBoxY = this.height / 3 - 50;

        // Function to create an edit icon if the corresponding value is available
        this.createEditIcon = (x, y, key, callback) => {
            
            let editIcon = this.add.text(x, y, '[ EDIT ]', {
                fontSize: '10px',
                fill: '#ffff00',
                fontFamily: 'Arial'
            }).setInteractive();
        
            editIcon.on('pointerdown', callback);
            return editIcon;
        }
    
        let labelWidth = this.colorText.x - 36;
        let labelHeightColor = this.colorText.y;
        let labelHeightCallType = this.callType.y;
        let labelHeightContentType = this.contentType.y;

        // Create edit icons
        this.editColorIcon = this.createEditIcon(labelWidth, labelHeightColor, 'selectedColor', () => {
            if (this.drillContainer) this.drillContainer.destroy();
            this.currentPage = 0;
            this.updatePage();
            // change button
            this.changeOptions();
        });
        
        this.editCallIcon = this.createEditIcon(labelWidth, labelHeightCallType, 'selectedCall', () => {
            if (this.drillContainer) this.drillContainer.destroy();
            this.currentPage = 1;
            this.updatePage();
            // change button
            this.changeOptions();
        });
    
        this.editContentIcon = this.createEditIcon(labelWidth, labelHeightContentType, 'selectedContent', () => {
            if (this.drillContainer) this.drillContainer.destroy();
            this.currentPage = 2;
            this.updatePage();
            // change button
            this.changeOptions();
        });

        this.optionsContainer.add([
            this.editColorIcon,
            this.editCallIcon,
            this.editContentIcon
        ]);

        // Retrieve stored values
        const selectedColor = localStorage.getItem('selectedColor');
        const selectedCall = localStorage.getItem('selectedCall');
        const selectedContent = localStorage.getItem('selectedContent');

        // Update visibility of options
        this.editColorIcon.setVisible(!!selectedColor);
        this.editCallIcon.setVisible(!!selectedCall);
        this.editContentIcon.setVisible(!!selectedContent);
    }

    changeOptions() {
        
        // Hide timer button or window
        if (this.timerContainer) this.timerContainer.destroy(); // Removes the timer window
        if (this.timerButton) this.timerButton.visible = false;

        let backBtn = document.getElementById('backBtn');
        if (backBtn) backBtn.remove();
        let confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) confirmBtn.innerHTML = 'Change';
        
        this.onChange = true;
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

        if (this.currentPage === 0) {
            this.formContainer.destroy();
            this.createSelectionForm();
        }

        if (this.currentPage === 1) {
            this.formContainer.destroy();
            this.createSelectionForm2();
        } else if (this.currentPage === 2) {
            this.formContainer.destroy();
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
            this.updateSelections();
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

    showTimer() {
        this.timerContainer = this.add.dom(this.width / 4, (this.height) - this.height / 4).createFromHTML(`
            <div style="border: solid 5px black;">
                <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; background: black; padding-bottom: 5px;">
                    <span style="color: white; font-weight: bold;">TIMER</span>
                    <span id="closeTimer" style="cursor: pointer; font-weight: bold; color: white;">[ X ]</span>
                </div>
                <div id="timerContainer" style="background: white;"></div>
            </div>
        `);
        
        this.timerContainer.getChildByID('closeTimer').addEventListener('click', () => {
            this.timerContainer.destroy(); // Removes the timer window
            // Show the button when timer is active
            this.timerButton.setVisible(true);
        });
        
        new CountdownTimer('timerContainer', 10);
    }

    doDrills(arrayType = []) {
        if (arrayType.length === 0) {
            this.submitCustomArray();
            return;
        }

    // Get checkbox state from saved setting
    const boxChecked = localStorage.getItem('randomizeEnabled') === 'true';

    // Create a fresh copy every time from the original
    this.filteredVerses = boxChecked
        ? [...arrayType].sort(() => Math.random() - 0.5)
        : [...arrayType]; // always reset to a fresh copy

        this.drillContainer = this.add.dom(this.width / 2, this.height / 3 + 50).createFromHTML(`
                <button id="prevDrill" style="visibility: hidden;">Previous</button>
                <button id="nextDrill">Next</button>
                <label>Randomize Order <input type="checkbox" id="randomizeToggle"></label>
                <div id="drillContent"></div>
                <div id="drillAnswer"></div>
                <button id="answerDrill">See Answer</button>
        `);
        this.drillContainer.node.style.color = 'white';
        this.drillContainer.node.style.width = '80%';

        // Update checkbox
        const checkbox = document.getElementById('randomizeToggle');
        checkbox.checked = boxChecked;
    
        // Add toggle logic
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            localStorage.setItem('randomizeEnabled', isChecked);
            
            if (this.drillContainer) this.drillContainer.destroy();
            this.doDrills(arrayType); // Pass original array again
        });
        
        // Clear
        this.mainText.setText("");
        this.subText.setText("");
        const customForm = document.getElementById('customForm');
        if (customForm) customForm.remove();

        // Create drill output
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

if (!this.timerButton) {
        // Create a button that toggles the timer
        this.timerButton = this.add.text(this.width / 4, (this.height) - this.height / 4, 'Show Timer', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        // Button click toggles the timer
        this.timerButton.on('pointerdown', () => {
            this.timerButton.setVisible(false);
            this.showTimer();
        });
} else {
    this.timerButton.setVisible(true);
}
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
        // Add edit options
        if (!this.valuesSet) {
            const selectedColor = localStorage.getItem('selectedColor');
            const selectedCall = localStorage.getItem('selectedCall');
            const selectedContent = localStorage.getItem('selectedContent');

            this.valuesSet = !!(selectedColor && selectedCall && selectedContent);

            if (this.valuesSet) {
                this.setEditIcons();
            }
        }

        // Organize array data
        this.setupArrays();
        
        if (localStorage.getItem("selectedContent") === 'All') {
            // Store array data
            localStorage.setItem("allArray", JSON.stringify(this.filteredVerses));
            //if (localStorage.getItem("customArray")) localStorage.removeItem("customArray");
            this.doDrills(this.filteredVerses);
        } else {
            
            this.timerButton.setVisible(false);
            // Load stored array
            if (localStorage.getItem("customArray")) {
                this.customArray = JSON.parse(localStorage.getItem("customArray"));
            } else {
                this.customArray = []; // Ensure it's always an array
            }            

            // Create container for the form
            this.drillContainer = this.add.dom(this.width / 1.65, this.centerY + 130).createFromHTML(`
                <div id="customForm" style="
                    text-align: center;
                    font-family: Arial;
                    color: #ffffff;
                    padding: 15px;
                    border-radius: 10px;
                    width: 70%;">
                    
                    <div id="verseSelectionContainer" 
                         style="text-align: left; display: inline-block; 
                                max-height: 180px; overflow-y: auto; width: 100%;
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
                    const verseId = container.dataset.id;
                    const verse = self.filteredVerses.find(v => encodeURIComponent(v.name || v.verse_ul || v.book) === verseId);
            
                    if (verse) {
                        // Auto-select if it was previously stored
                        if (self.customArray.some(v => encodeURIComponent(v.name || v.verse_ul || v.book) === verseId)) {
                            container.classList.add('selected');
                            container.style.backgroundColor = 'green';
                            this.updateSelections();
                        }
            
                        // Click event for selection
                        container.addEventListener('click', function() {
                            const isSelected = this.classList.toggle('selected');
                            this.style.backgroundColor = isSelected ? 'green' : 'black';
            
                            if (isSelected) {
                                self.customArray.push(verse);
                            } else {
                                self.customArray = self.customArray.filter(v => encodeURIComponent(v.name || v.verse_ul || v.book) !== verseId);
                            }
                        });
                    }
                });
            }, 0);
            
            // Handle selection update
            document.getElementById('submitSelection').addEventListener('click', () => {
                this.submitCustomArray();
            });
        }
    }

    submitCustomArray() {
        if (!this.customArray || this.customArray.length === 0) {
            // Check if the error message already exists
            let errorMessage = document.getElementById('selectionError');
            if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.id = 'selectionError';
                errorMessage.style.color = 'red';
                errorMessage.style.marginTop = '10px';
                errorMessage.textContent = 'Please select at least one item before proceeding.';
                document.getElementById('customForm').appendChild(errorMessage);
            }
        } else {
            // Remove error message if it exists and selection is valid
            let errorMessage = document.getElementById('selectionError');
            if (errorMessage) {
                errorMessage.remove();
            }
            
            this.updateCustomArray();
        }
    }

    updateCustomArray() {
        this.customArray = []; // Reset selection
        
        document.querySelectorAll('.verse-container.selected').forEach(container => {
            const verseId = container.dataset.id;
            const verse = this.filteredVerses.find(v => encodeURIComponent(v.name || v.verse_ul || v.book) === verseId);
            
            if (verse) {
                this.customArray.push(verse);
                this.contentType_val.setText('Custom (' + this.customArray.length + ')');
            }
        });
    
        // Store custom data
        localStorage.setItem("customArray", JSON.stringify(this.customArray));
        //if (localStorage.getItem("allArray")) localStorage.removeItem("allArray");
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
            
            if (this.onChange) {
                // Set to last page to setup drill next
                this.currentPage = 2;
                this.onChange = false;
                this.timerButton.setVisible(true);
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
                <div id="changeDiv"></div>
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
                <div id="changeDiv"></div>
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
               <div id="changeDiv"></div>
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