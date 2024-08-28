let bluetoothDevice;
let bluetoothCharacteristic;
let keyMappings = [];

const translations = {
    en: {
        title: "Arduino Bluetooth IDE",
        scan: "Scan for Bluetooth Devices",
        addKey: "Add New Key",
        add: "Add Key",
        script: "Arduino Script:",
        scriptPlaceholder: "Type your Arduino script here...",
        send: "Send Script",
        logs: "Logs",
        error: "Error",
        close: "Close",
        keyPressed: "Key pressed"
    },
    pt: {
        title: "Arduino Bluetooth IDE",
        scan: "Procurar Dispositivos Bluetooth",
        addKey: "Adicionar Nova Tecla",
        add: "Adicionar Tecla",
        script: "Script Arduino:",
        scriptPlaceholder: "Digite seu script Arduino aqui...",
        send: "Enviar Script",
        logs: "Logs",
        error: "Erro",
        close: "Fechar",
        keyPressed: "Tecla pressionada"
    },
    es: {
        title: "Arduino Bluetooth IDE",
        scan: "Buscar Dispositivos Bluetooth",
        addKey: "Añadir Nueva Tecla",
        add: "Añadir Tecla",
        script: "Script de Arduino:",
        scriptPlaceholder: "Escribe tu script de Arduino aquí...",
        send: "Enviar Script",
        logs: "Registros",
        error: "Error",
        close: "Cerrar",
        keyPressed: "Tecla presionada"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    const scriptInput = document.getElementById('scriptInput');
    const sendButton = document.getElementById('sendButton');
    const logArea = document.getElementById('logArea');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeModal = document.getElementById('closeModal');
    const addKeyButton = document.getElementById('addKeyButton');
    const keyboardKey = document.getElementById('keyboardKey');
    const associatedChar = document.getElementById('associatedChar');
    const keyMappingsContainer = document.getElementById('keyMappings');
    const languageSelect = document.getElementById('languageSelect');

    // Populate keyboard keys dropdown
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Backspace', 'Tab', 'Shift', 'Control', 'Alt', 'Escape'];
    for (let i = 65; i <= 90; i++) {
        keys.push(String.fromCharCode(i));
    }
    keys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        keyboardKey.appendChild(option);
    });

    // Check Web Bluetooth API support
    if (!navigator.bluetooth) {
        handleError('Bluetooth not supported', new Error('This browser does not support Web Bluetooth API'));
        scanButton.disabled = true;
    }

    // Load saved key mappings
    loadKeyMappings();

    // Event listeners
    scanButton.addEventListener('click', scanBluetoothDevices);
    sendButton.addEventListener('click', sendScript);
    closeModal.addEventListener('click', () => errorModal.classList.add('hidden'));
    addKeyButton.addEventListener('click', addKeyMapping);
    languageSelect.addEventListener('change', changeLanguage);

    // Initialize language
    changeLanguage();

    async function scanBluetoothDevices() {
        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['generic_access', '0000ffe0-0000-1000-8000-00805f9b34fb']
            });
            addLog(`Bluetooth device selected: ${device.name}`);
            connectToDevice(device);
        } catch (error) {
            handleError('Error scanning Bluetooth devices', error);
        }
    }

    async function connectToDevice(device) {
        try {
            bluetoothDevice = device;
            const server = await bluetoothDevice.gatt.connect();
            addLog('Connected to GATT server.');

            const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
            addLog('Bluetooth service found.');

            bluetoothCharacteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
            addLog('Bluetooth characteristic found.');

            sendButton.disabled = false;
            scanButton.textContent = translations[languageSelect.value].scan;
        } catch (error) {
            handleError('Error in Bluetooth connection', error);
        }
    }

    async function sendScript() {
        const script = scriptInput.value;
        if (!script.trim()) {
            handleError('Empty script', new Error('No script to send'));
            return;
        }

        try {
            if (!bluetoothCharacteristic) {
                throw new Error('Bluetooth characteristic not found');
            }
            const chunks = script.match(/.{1,20}/g);
            for (const chunk of chunks) {
                await bluetoothCharacteristic.writeValue(new TextEncoder().encode(chunk));
            }
            addLog('Script sent successfully');
        } catch (error) {
            handleError('Error sending script', error);
        }
    }

    async function sendChar(char) {
        try {
            if (!bluetoothCharacteristic) {
                throw new Error('Bluetooth characteristic not found');
            }
            await bluetoothCharacteristic.writeValue(new TextEncoder().encode(char));
            addLog(`Character '${char}' sent successfully`);
        } catch (error) {
            handleError('Error sending character', error);
        }
    }

    function addLog(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function handleError(message, error) {
        console.error(message, error);
        errorMessage.textContent = `${message}: ${error.message}`;
        errorModal.classList.remove('hidden');
        addLog(`Error: ${message}`);
    }

    function addKeyMapping() {
        const key = keyboardKey.value;
        const char = associatedChar.value.trim();
        if (key && char) {
            keyMappings.push({ key, char });
            saveKeyMappings();
            renderKeyMappings();
            associatedChar.value = '';
        } else {
            handleError('Invalid input', new Error('Key and character are required'));
        }
    }

    function renderKeyMappings() {
        keyMappingsContainer.innerHTML = '';
        keyMappings.forEach((mapping, index) => {
            const mappingElement = document.createElement('div');
            mappingElement.className = 'key-mapping';
            mappingElement.textContent = `${mapping.key} → ${mapping.char}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.addEventListener('click', () => {
                keyMappings.splice(index, 1);
                saveKeyMappings();
                renderKeyMappings();
            });

            mappingElement.appendChild(deleteButton);
            keyMappingsContainer.appendChild(mappingElement);
        });
    }

    function saveKeyMappings() {
        localStorage.setItem('arduinoKeyMappings', JSON.stringify(keyMappings));
    }

    function loadKeyMappings() {
        const savedMappings = localStorage.getItem('arduinoKeyMappings');
        if (savedMappings) {
            keyMappings = JSON.parse(savedMappings);
            renderKeyMappings();
        }
    }

    function changeLanguage() {
        const lang = languageSelect.value;
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
    }

    // Keyboard event listener
    document.addEventListener('keydown', (event) => {
        const mapping = keyMappings.find(m => m.key === event.key);
        if (mapping) {
            event.preventDefault();
            const lang = languageSelect.value;
            addLog(`${translations[lang].keyPressed}: ${mapping.key} → ${mapping.char}`);
            sendChar(mapping.char);
        }
    });

    // Disconnect the device when the page is closed
    window.addEventListener('beforeunload', () => {
        if (bluetoothDevice && bluetoothDevice.gatt.connected) {
            bluetoothDevice.gatt.disconnect();
        }
    });
});
