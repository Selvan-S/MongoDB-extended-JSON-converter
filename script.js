document.addEventListener('DOMContentLoaded', function () {
    const inputJson = document.getElementById('inputJson');
    const outputJson = document.getElementById('outputJson');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Stats elements
    const inputCharCount = document.getElementById('inputCharCount');
    const inputLineCount = document.getElementById('inputLineCount');
    const inputDepth = document.getElementById('inputDepth');
    const outputCharCount = document.getElementById('outputCharCount');
    const outputLineCount = document.getElementById('outputLineCount');
    const processingTime = document.getElementById('processingTime');

    // Focus on input when page loads
    inputJson.focus();

    // Update stats when input changes
    inputJson.addEventListener('input', updateInputStats);

    // Convert button event listener
    convertBtn.addEventListener('click', convertJson);

    // Copy button event listener
    copyBtn.addEventListener('click', function () {
        if (outputJson.value) {
            outputJson.select();
            document.execCommand('copy');
            showNotification('JSON copied to clipboard!', 'success');
        } else {
            showNotification('Nothing to copy!', 'error');
        }
    });

    // Format button event listener
    formatBtn.addEventListener('click', function () {
        if (outputJson.value) {
            try {
                const parsed = JSON.parse(outputJson.value);
                outputJson.value = JSON.stringify(parsed, null, 2);
                updateOutputStats();
                showNotification('Output formatted!', 'success');
            } catch (e) {
                showNotification('Invalid JSON for formatting!', 'error');
            }
        }
    });

    // Clear button event listener
    clearBtn.addEventListener('click', function () {
        inputJson.value = '';
        outputJson.value = '';
        inputJson.focus();
        updateInputStats();
        updateOutputStats();
        showNotification('Input and output cleared!', 'success');
    });

    // Show notification function
    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        notification.className = 'notification';

        if (type === 'error') {
            notification.classList.add('error');
        } else if (type === 'warning') {
            notification.classList.add('warning');
        } else {
            notification.classList.add('success');
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Update input statistics
    function updateInputStats() {
        const text = inputJson.value;
        inputCharCount.textContent = text.length;
        inputLineCount.textContent = text.split('\n').length;

        // Estimate depth by counting opening braces
        let depth = 0;
        let maxDepth = 0;
        for (let char of text) {
            if (char === '{') {
                depth++;
                if (depth > maxDepth) maxDepth = depth;
            } else if (char === '}') {
                depth--;
            }
        }
        inputDepth.textContent = maxDepth;
    }

    // Update output statistics
    function updateOutputStats() {
        const text = outputJson.value;
        outputCharCount.textContent = text.length;
        outputLineCount.textContent = text.split('\n').length;
    }

    // Conversion function
    function convertJson() {
        const input = inputJson.value.trim();

        if (!input) {
            showNotification('Please enter some JSON to convert!', 'error');
            return;
        }

        try {
            const startTime = performance.now();
            const parsedInput = JSON.parse(input);
            const converted = convertExtendedJSON(parsedInput);
            const endTime = performance.now();

            outputJson.value = JSON.stringify(converted, null, 2);
            updateOutputStats();

            const timeTaken = endTime - startTime;
            processingTime.textContent = `${timeTaken.toFixed(2)}ms`;

            showNotification(`Converted successfully in ${timeTaken.toFixed(2)}ms!`, 'success');
        } catch (error) {
            outputJson.value = `Error: ${error.message}`;
            updateOutputStats();
            showNotification('Invalid JSON format!', 'error');
        }
    }

    // Enhanced Extended JSON conversion logic
    function convertExtendedJSON(obj) {
        if (Array.isArray(obj)) {
            return obj.map(convertExtendedJSON);
        }

        if (obj !== null && typeof obj === 'object') {
            const keys = Object.keys(obj);

            // Handle MongoDB extended types
            if (keys.length === 1) {
                const key = keys[0];
                const value = obj[key];

                switch (key) {
                    case '$oid':
                        return value;
                    case '$date':
                        // Handle both string and object formats
                        if (typeof value === 'string') return value;
                        if (value?.$numberLong) return new Date(Number(value.$numberLong)).toISOString();
                        if (value?.$numberInt) return new Date(Number(value.$numberInt)).toISOString();
                        return value;
                    case '$numberLong':
                    case '$numberDouble':
                    case '$numberDecimal':
                        return Number(value);
                    case '$numberInt':
                        return Number(value);
                    case '$binary':
                        return value.base64 ? value.base64 : value;
                    case '$regularExpression':
                    case '$regex':
                        return new RegExp(value.pattern, value.options);
                    case '$timestamp':
                        return value;
                    case '$minKey':
                        return 'MinKey';
                    case '$maxKey':
                        return 'MaxKey';
                    case '$undefined':
                        return null;
                    case '$ref':
                    case '$dbRef':
                        return convertExtendedJSON(value);
                }
            }

            // Handle DBRef objects
            if (keys.includes('$ref') && keys.includes('$id')) {
                return {
                    $ref: obj['$ref'],
                    $id: convertExtendedJSON(obj['$id']),
                    $db: obj['$db'] ? convertExtendedJSON(obj['$db']) : undefined
                };
            }

            // Recursively process other objects
            const result = {};
            for (const key of keys) {
                result[key] = convertExtendedJSON(obj[key]);
            }
            return result;
        }

        return obj;
    }

    // Load sample data for testing
    function loadSampleData() {
        const sampleData = `{
  "_id": { "$oid": "680639bbd68e63f868d7ecb3" },
  "orderId": { "$numberLong": "6192137634023" },
  "createdAt": { "$date": "2025-04-21T17:57:35.000Z" },
  "updatedAt": { "$date": "2025-04-23T10:05:29.000Z" },
  "totalPrice": "4000.00",
  "customer": {
    "id": { "$numberLong": "8046582366423" },
    "email": "example@yahoo.com",
    "createdAt": { "$date": "2025-04-21T17:40:02.000Z" }
  },
  "lineItems": [
    {
      "id": { "$numberLong": "15002310607023" },
      "name": "Mens Arm cut with Multicolor Logo - Grey / L",
      "price": "1450.00",
      "quantity": 1
    },
    {
      "id": { "$numberLong": "15002310639823" },
      "name": "Co-ord set - Oversize Arm Cut T-shirt",
      "price": "2350.00",
      "quantity": 1
    }
  ]
}`;

        inputJson.value = sampleData;
        updateInputStats();
        showNotification('Sample order data loaded!', 'success');
    }

    // Initialize with sample data
    loadSampleData();
});