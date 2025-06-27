# JSON Converter

A simple web-based tool to convert **MongoDB Extended JSON** to **Standard JSON**. This tool helps in transforming MongoDB-specific data types like `ObjectId`, `Date`, and `Binary` into standard JSON-compatible formats for easier usage across different platforms.

## Features

* **MongoDB Extended JSON to Standard JSON**: Converts MongoDB Extended JSON (including types like `ObjectId`, `Date`, `Binary`, etc.) to a clean, standard JSON format.
* **Live Preview**: See the converted JSON immediately after clicking the convert button.
* **Statistics**: Displays input and output statistics such as character count, line count, and JSON depth.
* **Copy to Clipboard**: Copy the converted JSON with a single click.
* **JSON Formatting**: Format the output JSON for better readability.

## Hosted Version

You can access the tool online via the hosted version on GitHub Pages:

[https://selvan-s.github.io/json-converter/](https://selvan-s.github.io/json-converter/)

## Usage

1. **Enter your MongoDB Extended JSON** into the input area.
2. Click **Convert** to transform the input into Standard JSON.
3. Use **Copy to Clipboard** to copy the output JSON.
4. Click **Clear** to reset both input and output fields.

## Getting Started

You can also download and use the tool directly from the repository. No installation or npm package required.

1. Clone the repository:

   ```bash
   git clone https://github.com/Selvan-S/json-converter.git
   cd json-converter
   ```

2. Open `index.html` in your browser to start using the tool.