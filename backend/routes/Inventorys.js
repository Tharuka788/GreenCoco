const router = require("express").Router();
const nodemailer = require('nodemailer');
let Inventory = require("../models/Inventory");

const LOW_STOCK_THRESHOLD = 10;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'malindujayawickrama462@gmail.com', // Replace with your Gmail address
    pass: 'swjoypggergmgrre',    // Replace with your Gmail App Password
  },
});

// Email sending function
const sendLowStockEmail = async (inventoryItem) => {
  const mailOptions = {
    from: 'malindujayawickrama462@gmail.com', // Replace with your Gmail address
    to: 'wellagesandali@gmail.com', // Replace with a valid recipient email address
    subject: `Low Stock Alert: ${inventoryItem.batchId}`,
    text: `The inventory item with Batch ID ${inventoryItem.batchId} is low on stock!\n\n` +
          `Total Weight: ${inventoryItem.totalWeight} kg (Threshold: ${LOW_STOCK_THRESHOLD} kg)\n` +
          `Waste Type: ${inventoryItem.wasteType}\n` +
          `Source Location: ${inventoryItem.sourceLocation}\n` +
          `Please take action to restock this item.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Low stock email sent for Batch ID: ${inventoryItem.batchId}`);
  } catch (error) {
    console.error('Error sending low stock email:', error);
  }
};

// Route to add a new inventory item
router.route("/add").post(async (req, res) => {
  const batchId = req.body.batchId;
  const collectionDate = new Date(req.body.collectionDate);
  const sourceLocation = req.body.sourceLocation;
  const totalWeight = Number(req.body.totalWeight);
  const wasteType = req.body.wasteType;
  const qualityGrade = req.body.qualityGrade;
  const processingStatus = req.body.processingStatus;
  const processingMethod = req.body.processingMethod;
  const notes = req.body.notes;

  const newInventory = new Inventory({
    batchId,
    collectionDate,
    sourceLocation,
    totalWeight,
    wasteType,
    qualityGrade,
    processingStatus,
    processingMethod,
    notes,
  });

  try {
    const savedInventory = await newInventory.save();
    
    // Check for low stock and send email if needed
    if (totalWeight < LOW_STOCK_THRESHOLD && !savedInventory.lowStockNotified) {
      await sendLowStockEmail(savedInventory);
      savedInventory.lowStockNotified = true;
      await savedInventory.save();
    }

    res.json({ message: "Inventory Added", lowStock: totalWeight < LOW_STOCK_THRESHOLD });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get all inventory items
router.route("/").get((req, res) => {
  Inventory.find()
    .then((inventories) => {
      const inventoriesWithLowStock = inventories.map(item => ({
        ...item._doc,
        lowStock: item.totalWeight < LOW_STOCK_THRESHOLD
      }));
      res.json(inventoriesWithLowStock);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Route to update an inventory item by ID
router.route("/update/:id").put(async (req, res) => {
  let userId = req.params.id;
  const { batchId, collectionDate, sourceLocation, totalWeight, wasteType, qualityGrade, processingStatus, processingMethod, notes } = req.body;

  const updateInventory = {
    batchId,
    collectionDate,
    sourceLocation,
    totalWeight,
    wasteType,
    qualityGrade,
    processingStatus,
    processingMethod,
    notes,
  };

  try {
    const inventory = await Inventory.findById(userId);
    if (!inventory) {
      return res.status(404).send({ status: "Inventory not found" });
    }

    const updatedInventory = await Inventory.findByIdAndUpdate(userId, updateInventory, { new: true });

    // Check for low stock and send email if needed
    if (totalWeight < LOW_STOCK_THRESHOLD && !updatedInventory.lowStockNotified) {
      await sendLowStockEmail(updatedInventory);
      updatedInventory.lowStockNotified = true;
      await updatedInventory.save();
    }

    res.status(200).send({ 
      status: "Inventory updated",
      lowStock: totalWeight < LOW_STOCK_THRESHOLD
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error with updating data", error: err.message });
  }
});

// Route to delete an inventory item by ID
router.route("/delete/:id").delete(async (req, res) => {
  let userId = req.params.id;

  await Inventory.findByIdAndDelete(userId)
    .then(() => {
      res.status(200).send({ status: "Inventory deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with delete user", error: err.message });
    });
});

// Route to get a specific inventory item by ID
router.route("/get/:id").get(async (req, res) => {
  let userId = req.params.id;

  await Inventory.findById(userId)
    .then((inventory) => {
      res.status(200).send({ 
        status: "Inventory fetched", 
        inventory: {
          ...inventory._doc,
          lowStock: inventory.totalWeight < LOW_STOCK_THRESHOLD
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with get user", error: err.message });
    });
});

// Route to get low stock inventory items
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({ totalWeight: { $lt: LOW_STOCK_THRESHOLD } });
    res.status(200).json(lowStockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;