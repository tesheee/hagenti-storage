import mongoose, { Schema } from "mongoose";

const cartridgeSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // предполагаем, что у тебя есть модель User
      required: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    tonerColor: {
      type: String,
      enum: ["черный", "желтый", "голубой", "красный"],
      required: true,
    },
    printerModels: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: [
        "Склад",
        "В использовании",
        "Ожидает заправки",
        "На заправке",
        "Списан",
      ],
      default: "Склад",
      required: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // автоматически добавит createdAt и updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Cartridge ||
  mongoose.model("Cartridge", cartridgeSchema);
