# arduino-bluetooth-ide# Arduino Bluetooth IDE

This is a web-based IDE for Arduino that utilizes Bluetooth to connect and send scripts to your Arduino board wirelessly. The project is built with HTML, JavaScript, and TailwindCSS. It allows you to scan for Bluetooth devices, send Arduino scripts, and assign custom key mappings to specific characters, which can be transmitted via Bluetooth to your device.

## Getting Started

### Prerequisites

To use this project, you'll need:

- A compatible browser (Chrome or Edge) that supports Web Bluetooth API.
- An Arduino device with Bluetooth enabled (e.g., HC-05, HC-06, etc.).
- Basic knowledge of Arduino scripting.

### Enabling Experimental Web Platform Features

To make sure the Bluetooth API works correctly, you must enable experimental web platform features in your browser:

1. Open Chrome and type `chrome://flags/` into the address bar.
2. Search for **Experimental Web Platform features**.
3. Set this flag to **Enabled**.
4. Relaunch your browser.

### Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/iagolirapasssos/arduino-bluetooth-ide.git
    ```

2. Navigate to the project folder:
    ```bash
    cd arduino-bluetooth-ide
    ```

3. Open `index.html` in your preferred browser (Chrome or Edge).

### Using the IDE

1. **Scanning for Bluetooth Devices:**
   - Click the "Scan for Bluetooth Devices" button to search for nearby Bluetooth devices.
   - Select your Arduino device from the list.

2. **Writing Arduino Script:**
   - Type your Arduino script in the provided textarea.
   - Click "Send Script" to send the script to your connected Arduino device.

3. **Adding Key Mappings:**
   - Choose a key from the dropdown list and associate it with a character.
   - Click "Add Key" to save the mapping.
   - Press the selected key to send the associated character via Bluetooth.

4. **Viewing Logs:**
   - All connection and transmission logs are displayed in the logs section. Errors are also displayed in a modal window if they occur.

### Customizing Key Mappings

You can customize key mappings by selecting a key and associating it with a character. This feature allows you to send individual characters to your Arduino device by pressing the assigned key.

### Supported Keys

This IDE supports alphanumeric keys and a variety of control keys, including:

- Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`)
- `Enter`, `Backspace`, `Tab`, `Shift`, `Control`, `Alt`, `Escape`
- A-Z (uppercase letters)
- a-z (lowercase letters)

### Languages

The interface supports multiple languages, including English, Portuguese, and Spanish. You can change the language using the dropdown in the bottom-right corner.

### Troubleshooting

- **Bluetooth not supported**: Make sure you are using a compatible browser (Chrome or Edge) and that Web Bluetooth API is enabled.
- **Error sending script**: Ensure that your Arduino device is properly connected and that the script is not empty.

### Known Issues

- The Web Bluetooth API may not work on all platforms, such as iOS or older browsers.
- Ensure that Bluetooth permissions are granted for the page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contributions

Feel free to contribute to this project by forking the repository, making your changes, and submitting a pull request.
