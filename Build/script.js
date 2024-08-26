let memory = 0;

function clearDisplay() {
    document.getElementById('display').value = '';
}

function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function calculate() {
    let display = document.getElementById('display');
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Error';
    }
}

function backspace() {
    let display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

// Memory functions
function memorySave() {
    let display = document.getElementById('display');
    memory = parseFloat(display.value) || 0;
    display.value = '';
}

function memoryRecall() {
    document.getElementById('display').value += memory;
}
