const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


const drugs = [
  { id: 1, name: "Amoxicillin", category: "Antibiotic", dosageMg: 500, isPrescriptionOnly: true, stock: 120, manufacturer: "Pfizer" },
  { id: 2, name: "Paracetamol", category: "Analgesic", dosageMg: 1000, isPrescriptionOnly: false, stock: 200, manufacturer: "GSK" },
  { id: 3, name: "Ibuprofen", category: "Analgesic", dosageMg: 400, isPrescriptionOnly: false, stock: 150, manufacturer: "Bayer" },
  { id: 4, name: "Chloroquine", category: "Antimalarial", dosageMg: 250, isPrescriptionOnly: true, stock: 80, manufacturer: "Sanofi" },
  { id: 5, name: "Ciprofloxacin", category: "Antibiotic", dosageMg: 500, isPrescriptionOnly: true, stock: 70, manufacturer: "Pfizer" },
  { id: 6, name: "Loratadine", category: "Antihistamine", dosageMg: 10, isPrescriptionOnly: false, stock: 160, manufacturer: "Novartis" },
  { id: 7, name: "Metformin", category: "Antidiabetic", dosageMg: 850, isPrescriptionOnly: true, stock: 140, manufacturer: "Teva" },
  { id: 8, name: "Artemether", category: "Antimalarial", dosageMg: 20, isPrescriptionOnly: true, stock: 60, manufacturer: "Roche" },
  { id: 9, name: "Aspirin", category: "Analgesic", dosageMg: 300, isPrescriptionOnly: false, stock: 180, manufacturer: "Bayer" },
  { id: 10, name: "Omeprazole", category: "Antacid", dosageMg: 20, isPrescriptionOnly: true, stock: 90, manufacturer: "AstraZeneca" },
  { id: 11, name: "Azithromycin", category: "Antibiotic", dosageMg: 250, isPrescriptionOnly: true, stock: 50, manufacturer: "Pfizer" },
  { id: 12, name: "Cetirizine", category: "Antihistamine", dosageMg: 10, isPrescriptionOnly: false, stock: 110, manufacturer: "Novartis" },
  { id: 13, name: "Insulin", category: "Antidiabetic", dosageMg: 100, isPrescriptionOnly: true, stock: 30, manufacturer: "Novo Nordisk" },
  { id: 14, name: "Artemisinin", category: "Antimalarial", dosageMg: 100, isPrescriptionOnly: true, stock: 50, manufacturer: "GSK" },
  { id: 15, name: "Codeine", category: "Analgesic", dosageMg: 30, isPrescriptionOnly: true, stock: 20, manufacturer: "Teva" },
  { id: 16, name: "Vitamin C", category: "Supplement", dosageMg: 500, isPrescriptionOnly: false, stock: 300, manufacturer: "Nature’s Bounty" },
  { id: 17, name: "Ranitidine", category: "Antacid", dosageMg: 150, isPrescriptionOnly: false, stock: 90, manufacturer: "Sanofi" },
  { id: 18, name: "Doxycycline", category: "Antibiotic", dosageMg: 100, isPrescriptionOnly: true, stock: 40, manufacturer: "Pfizer" },
  { id: 19, name: "Tramadol", category: "Analgesic", dosageMg: 50, isPrescriptionOnly: true, stock: 45, manufacturer: "Teva" },
  { id: 20, name: "Folic Acid", category: "Supplement", dosageMg: 5, isPrescriptionOnly: false, stock: 250, manufacturer: "Nature’s Bounty" }
 ];

app.use(express.json());

// Define a GET route to return all drugs with
// category "Antibiotics"
app.get('/drugs/antibiotics', (req, res) => {

  // Filter the drugs where category is "Antibiotic"
  const antibiotics = drugs.filter(drug => drug.category === "Antibiotic");

  // Return the filtered list as JSON response
  res.json(antibiotics)
});


// Define a GET route to return all drug names in lowercase
app.get('/drugs/names', (req, res) => {

  // creates new array of drugs converted to lowerCase
  const convertedNames = drugs.map(drug => ({
    ...drug,
    name: drug.name.toLowerCase()
    }))

    // Return the new array as JSON response
  res.json(convertedNames)
});

// Define a POST route to return all drugs 
// under a specific category 
app.post('/drugs/by-category', (req, res) => {

  // Extract category from the request body
  const {category} = req.body

  if (!category) {
    // if no category provided, return a
    // 400 Bad Request error
    return res.status(400).json({
      message: "Category is required"
    });
  }

  // filter the drugs matching the given category
  const matchingDrugs = drugs.filter(drug => drug.category === category)

  // return the filtered drugs
  res.json(matchingDrugs);
})

// Define a GET route to return each drug's name
// and manufacturer
app.get('/drugs/names-manufacturers', (req, res) => {
  
  // Map each drug into a new object with only name 
  // and manufacturer
  const mappedDrugs = drugs.map(drug => ({
    drugName: drug.name,
    manufacturerName: drug.manufacturer
  }));
  
  // Return the new array
  res.json(mappedDrugs);
})

// Define a GET route to return all
// prescription-only drugs
app.get('/drugs/prescription', (req, res) => {
  
  // Filter drugs where isPrescriptionOnly is true
  const prescriptionDrugs = drugs.filter( drug =>
    drug.isPrescriptionOnly);

// return the result
res.json(prescriptionDrugs);
});

// Define a GET route to return formatted drug
// names and dosages
app.get('/drugs/formatted', (req, res) => {
  
  // Map each drug into a formatted string
  const namedDrugs = drugs.map(drug =>
    `Drug: ${drug.name} - ${drug.dosageMg}mg`
  );
  
  // Return the formatted array
  res.json(namedDrugs);
});

// Define a GET route to return all drugs with
// stock less than 50
app.get('/drugs/low-stock', (req, res) => {
  
  // Filter drugs where stock is less than 50
  const lowStorageDrugs = drugs.filter(drug =>
    drug.stock < 50);
  // Return the fitered array
  res.json(lowStorageDrugs);
})


// Define a GET route to return 
// non-prescription drugs
app.get('/drugs/non-prescription', (req, res) => {
  // Filter drugs where isPrescriptionOnly is false
  const nonPrescriptionDrugs = drugs.filter( drug => 
    !drug.isPrescriptionOnly);
  // Return the filtered array
  res.json(nonPrescriptionDrugs)
});

// Define a POST route to count how many drugs are 
// from a given manufacturer
app.post('/drugs/manufacturer-count', (req, res) => {

  // Extract manufacturer from the request body
  const {manufacturer} = req.body

  if (!manufacturer) {
    // if no manufacturer provided, return a
    // 400 Bad Request error
    return res.status(400).json({
      message: "Manufacturer is required"
    });
  }
  // Count the drugs that match the given manufacturer
  const count = drugs.filter(drug => drug.manufacturer === manufacturer).length
  // Return the count and manufacturer name
  res.json({manufacturer, count});
})

// Define a GET route to count all analgesic drugs
app.get('/drugs/count-analgesics', (req, res) => {
  // Filter and count drugs with category "analgesic"
  const count = drugs.filter(drug => drug.category === "analgesic").length;
  // Return the result as JSON
  res.json({ category: "Analgesic", count });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})