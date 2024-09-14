// Global variable to store CSV data
let csvData = [];

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  loadCSV(); // Load the CSV data on page load
});

// Function to load and parse the CSV file
function loadCSV() {
  Papa.parse("npk_calci_infomation.csv", {
    // Adjust the path to your CSV file
    download: true,
    header: true,
    complete: function (results) {
      csvData = results.data; // Store the parsed data
      populateDropdown(csvData); // Populate dropdown with options
    },
    error: function (error) {
      console.error("Error loading CSV file:", error);
    },
  });
}

// Function to populate the dropdown with NPK ratios
function populateDropdown(data) {
  const select = document.getElementById("ratio");
  data.forEach((row) => {
    const option = document.createElement("option");
    option.value = row.Ratio;
    option.textContent = row.Ratio;
    select.appendChild(option);
  });
}

// Function to calculate and display NPK data
function calculateNPK() {
  const ratio = document.getElementById("ratio").value;
  const area = parseFloat(document.getElementById("area").value);
  const unit = document.getElementById("unit").value;

  // Clear previous error message
  document.getElementById("error-message").style.display = "none";

  // Check if any required field is missing
  if (!ratio || isNaN(area) || area < 0 || !unit) {
    document.getElementById("error-message").textContent =
      "Enter the full detail";
    document.getElementById("error-message").style.display = "block";
    return;
  }

  // Check if area is negative
  if (area < 0) {
    alert("Area must be a non-negative value.");
    return;
  }

  // Find the selected ratio data
  const data = csvData.find((row) => row.Ratio === ratio);

  if (!data) {
    alert("Invalid NPK ratio");
    return;
  }

  // Convert area to square feet if it's in acres
  const conversionFactor = unit === "acre" ? 4046.86 : 1; // 1 acre = 4046.86 sq ft
  const amount = area * conversionFactor * 1; // Example amount calculation
  const amountInGrams = amount;
  const amountInKilograms = amount / 1000;

  // Generate result HTML
  const result = `
        <h2>NPK Ratio: ${ratio}</h2>
        <p><strong>Common Name:</strong> ${data["Common Name"]}</p>
        <p><strong>Uses:</strong> ${data["Uses"]}</p>
        <p><strong>Focus Nutrient(s):</strong> ${data["Focus Nutrient(s)"]}</p>
        <p><strong>Description:</strong> ${data["Description"]}</p>
        <p><strong>Amount Required:</strong> ${
          amountInGrams < 1000
            ? amountInGrams.toFixed(2) + " grams"
            : amountInKilograms.toFixed(2) + " kilograms"
        }</p>
    `;
  document.getElementById("result").innerHTML = result;
}
