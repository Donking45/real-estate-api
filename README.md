# Drug Inventory API
This is a simple RESTful API built with Express.js that allows you to manage and query a list of pharmaceutical drugs. It supports operations such as retrieving drugs by category, listing prescription-only medications, checking low-stock items, and more.

**Features**

Get all antibiotics
Get all drug names in lowercase
Filter drugs by category
View drug names and manufacturers
View prescription-only or non-prescription drugs
Format drugs with name and dosage
Check for low-stock drugs
Count drugs by manufacturer
Count all analgesics


**Endpoints**

GET /drugs/antibiotics
Returns all drugs where the category is "Antibiotic".

GET /drugs/names
Returns all drugs with their names converted to lowercase.

POST /drugs/by-category
Returns all drugs under a specified category.
 Body Example:
{ "category": "Antibiotic" }


GET /drugs/names-manufacturers
Returns an array of objects showing each drug’s name and manufacturer.

GET /drugs/prescription
Returns all prescription-only drugs.

GET /drugs/non-prescription
Returns all drugs that are not prescription-only.

GET /drugs/formatted
Returns drugs in the format:
 Drug: [name] - [dosageMg]mg

GET /drugs/low-stock
Returns all drugs with a stock less than 50.

POST /drugs/manufacturer-count
Returns how many drugs are produced by a given manufacturer.
 Body Example:
{ "manufacturer": "Pfizer" }


GET /drugs/count-analgesics
Returns how many drugs fall under the "Analgesic" category.


