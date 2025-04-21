const Supplier = require('../models/supplier');

// Register a new supplier
exports.registerSupplier = async (req, res, next) => {
  try {
    const { supplierName, supplierProduct, quantity, amount, email } = req.body;

    // Check if supplier already exists by email
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({ message: 'Supplier with this email already exists' });
    }

    // Create new supplier
    const supplier = new Supplier({
      supplierName,
      supplierProduct,
      quantity,
      amount,
      email,
    });

    await supplier.save();
    res.status(201).json({ message: 'Supplier registered successfully', supplier });
  } catch (error) {
    next(error);
  }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    next(error);
  }
};

// Update a supplier by ID
exports.updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { supplierName, supplierProduct, quantity, amount, email } = req.body;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Check if the new email is already used by another supplier
    if (email && email !== supplier.email) {
      const existingSupplier = await Supplier.findOne({ email });
      if (existingSupplier) {
        return res.status(400).json({ message: 'Email already in use by another supplier' });
      }
    }

    // Update supplier fields
    supplier.supplierName = supplierName || supplier.supplierName;
    supplier.supplierProduct = supplierProduct || supplier.supplierProduct;
    supplier.quantity = quantity || supplier.quantity;
    supplier.amount = amount || supplier.amount;
    supplier.email = email || supplier.email;

    await supplier.save();
    res.status(200).json({ message: 'Supplier updated successfully', supplier });
  } catch (error) {
    next(error);
  }
};

// Delete a supplier by ID
exports.deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};