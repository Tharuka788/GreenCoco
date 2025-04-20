const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventorySchema = new Schema({

    batchId : {
        type : String,
        required: true
    },
    collectionDate : {
        type : Date,
        required: true
    },
    sourceLocation : {
        type : String,
        required: true
    },
    totalWeight : {
        type : Number,
        required: true
    },
    wasteType : {
        type : String,
        required: true
    },
    qualityGrade : {
        type : String,
        required: true
    },
    processingStatus : {
        type : String,
        required: true
    },
    processingMethod : {
        type : String,
        required: true
    },
    notes : {
        type : String,
        required: true
    }
})

const Inventory = mongoose.model("Inventory",inventorySchema);

module.exports = Inventory;