document.addEventListener('DOMContentLoaded', function () {
    const inputJson = document.getElementById('inputJson');
    const outputJson = document.getElementById('outputJson');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Focus on input when page loads
    inputJson.focus();

    // Convert button event listener
    convertBtn.addEventListener('click', convertJson);

    // Copy button event listener
    copyBtn.addEventListener('click', function () {
        if (outputJson.value) {
            outputJson.select();
            document.execCommand('copy');
            showNotification('JSON copied to clipboard!');
        } else {
            showNotification('Nothing to copy!', 'error');
        }
    });

    // Clear button event listener
    clearBtn.addEventListener('click', function () {
        inputJson.value = '';
        outputJson.value = '';
        inputJson.focus();
        showNotification('Input and output cleared!');
    });

    // Show notification function
    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        notification.className = 'notification';

        if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else {
            notification.style.background = '#2ecc71';
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Conversion function
    function convertJson() {
        const input = inputJson.value.trim();

        if (!input) {
            showNotification('Please enter some JSON to convert!', 'error');
            return;
        }

        try {
            const parsedInput = JSON.parse(input);
            const converted = convertExtendedJSON(parsedInput);
            outputJson.value = JSON.stringify(converted, null, 2);
        } catch (error) {
            outputJson.value = `Error: ${error.message}`;
            showNotification('Invalid JSON format!', 'error');
        }
    }

    // Extended JSON conversion logic
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
                        return value;
                    case '$numberLong':
                    case '$numberDouble':
                    case '$numberDecimal':
                        return value;
                    case '$numberInt':
                        return Number(value);
                    case '$binary':
                        return value;
                    case '$regularExpression':
                        return value;
                    case '$timestamp':
                        return value;
                    case '$minKey':
                        return 'MinKey';
                    case '$maxKey':
                        return 'MaxKey';
                    case '$undefined':
                        return null;
                }
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
});

// Load example function
function loadExample(num) {
    const examples = [
        `{
  "_id": { "$oid": "5f9d9b3d8c7a6b2a1c8e9f0d" },
  "name": "John Doe",
  "age": { "$numberInt": "30" },
  "isAdmin": false
}`,
        `{
  "event": "Conference",
  "date": { "$date": "2023-12-15T09:00:00Z" },
  "attendees": { "$numberInt": "250" },
  "location": "Convention Center"
}`,
        `{
  "product": "Laptop",
  "price": { "$numberDecimal": "1299.99" },
  "quantity": { "$numberInt": "15" },
  "total": { "$numberLong": "1949985" },
  "inStock": true
}`,
        `{
  "_id": { "$oid": "621f3d3a8c7a6b2a1c8e9f1a" },
  "name": "Alice",
  "createdAt": { "$date": "2023-06-23T08:30:00Z" },
  "scores": [
    { "$numberInt": "95" },
    { "$numberInt": "88" },
    { "$numberInt": "92" }
  ],
  "metadata": {
    "isActive": true,
    "lastLogin": { "$date": "2023-06-22T18:45:23Z" }
  }
}`
    ];

    document.getElementById('inputJson').value = examples[num - 1];
    document.getElementById('outputJson').value = '';
    document.getElementById('notification-text').textContent = `Example ${num} loaded!`;
    document.getElementById('notification').className = 'notification show';
    setTimeout(() => {
        document.getElementById('notification').className = 'notification';
    }, 2000);
}