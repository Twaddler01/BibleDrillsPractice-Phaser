////
const colorRadios = {
    Blue: this.formContainer.getChildByID("colorBlue"),
    Green: this.formContainer.getChildByID("colorGreen"),
    Red: this.formContainer.getChildByID("colorRed"),
};
const versionRadios = {
    KJV: this.formContainer.getChildByID("versionKJV"),
    CSB: this.formContainer.getChildByID("versionCSB"),
};

function createSetupForm(a_button, a_option1, a_option1Sel, a_option2, a_option2Sel) {
    const confirmBtn = this.formContainer.getChildByID(a_button);

    // Restore previous selections if available
    const storedOption1 = localStorage.getItem(a_option1Sel);
    const storedOption2 = localStorage.getItem(a_option2Sel);
    
    if (storedOption1 && a_option1[storedOption1]) {
        a_option1[storedOption1].checked = true;
    }
    if (storedOption2 && a_option2[storedOption2]) {
        a_option2[storedOption2].checked = true;
    }
    
    // Enable the button if both selections are restored
    if (storedOption1 && storedOption2) {
        confirmBtn.disabled = false;
    }
    
    // Check if both selections are made and enable the button
    const updateButtonState = () => {
        const option1Selected = Object.values(a_option1).some(r => r.checked);
        const option2Selected = Object.values(a_option2).some(r => r.checked);
        confirmBtn.disabled = !(option1Selected && option2Selected);
    };
    
    [...Object.values(a_option1), ...Object.values(a_option2)].forEach(radio => {
        radio.addEventListener("change", updateButtonState);
    });
    
    // Event listener for the "Continue" button
    confirmBtn.addEventListener("click", () => {
        const selectedOption1 = Object.keys(a_option1).find(color => a_option1[color].checked);
        const selectedOption2 = Object.keys(a_option2).find(version => a_option2[version].checked);
    
        // Save selections to localStorage
        localStorage.setItem(a_option1Sel, selectedOption1);
        localStorage.setItem(a_option2Sel, selectedOption2);
    
        this.selectedOption1 = selectedOption1;
        this.selectedOption2 = selectedOption2;
    
        this.startNextPage();
        
        return [selectedOption1, selectedOption2];
    });
}

createSetupForm(
    "confirmBtn", 
    colorRadios, 
    "selectedColor", 
    versionRadios, 
    "selectedVersion"
);