const router = require("express").Router(); // Import Express router
let Inventory = require("../models/Inventory"); // Import Inventory model

// Route to add a new inventory item
router.route("/add").post((req, res) => {
    // Extract data from the request body
    const batchId = req.body.batchId;
    const collectionDate = new Date(req.body.collectionDate);
    const sourceLocation = req.body.sourceLocation;
    const totalWeight = Number(req.body.totalWeight);
    const wasteType = req.body.wasteType;
    const qualityGrade = req.body.qualityGrade; // Fixed typo
    const processingStatus = req.body.processingStatus;
    const processingMethod = req.body.processingMethod;
    const notes = req.body.notes; // Changed to lowercase

    // Create a new inventory object
    const newInventory = new Inventory({
        batchId,
        collectionDate,
        sourceLocation,
        totalWeight,
        wasteType,
        qualityGrade,
        processingStatus,
        processingMethod,
        notes
    });

    // Save the new inventory item to the database
    newInventory.save()
        .then(() => res.json({ message: "Inventory Added" })) // Respond with success message
        .catch((err) => res.status(500).json({ error: err.message })); // Handle errors
});

// Route to get all inventory items
router.route("/").get((req, res) => {
    Inventory.find() // Fetch all inventory items from the database
        .then((inventories) => res.json(inventories)) // Respond with the inventory list
        .catch((err) => res.status(500).json({ error: err.message })); // Handle errors
});

// Route to update an inventory item by ID
router.route("/update/:id").put(async (req, res) => {
    let userId = req.params.id; // Get the inventory ID from URL parameters
    // Extract updated fields from request body
    const { batchId, collectionDate, sourceLocation, totalWeight, wasteType, qualityGrade, processingStatus, processingMethod, notes } = req.body;

    // Create an object with updated values
    const updateInventory = {
        batchId,
        collectionDate,
        sourceLocation,
        totalWeight,
        wasteType,
        qualityGrade,
        processingStatus,
        processingMethod,
        notes
    };

    // Find and update the inventory item in the database
    await Inventory.findByIdAndUpdate(userId, updateInventory)
        .then(() => {
            res.status(200).send({ status: "Inventory updated" }); // Respond with success message
        })
        .catch((err) => {
            console.log(err); // Log error to console
            res.status(500).send({ status: "Error with updating data", error: err.message }); // Respond with error message
        });
});

// Route to delete an inventory item by ID
router.route("/delete/:id").delete(async (req, res) => {
    let userId = req.params.id; // Get the inventory ID from URL parameters

    await Inventory.findByIdAndDelete(userId) // Find and delete the inventory item
        .then(() => {
            res.status(200).send({ status: "Inventory deleted" }); // Respond with success message
        })
        .catch((err) => {
            console.log(err.message); // Log error to console
            res.status(500).send({ status: "Error with delete user", error: err.message }); // Respond with error message
        });
});

// Route to get a specific inventory item by ID
router.route("/get/:id").get(async (req, res) => {
    let userId = req.params.id; // Get the inventory ID from URL parameters

    await Inventory.findById(userId) // Find the inventory item by ID
        .then((inventory) => {
            res.status(200).send({ status: "Inventory fetched", inventory }); // Respond with the fetched inventory data
        })
        .catch((err) => {
            console.log(err.message); // Log error to console
            res.status(500).send({ status: "Error with get user", error: err.message }); // Respond with error message
        });
});

// Export the router module for use in other files
module.exports = router;
