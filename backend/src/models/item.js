import mongoose from "mongoose"

const itemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        list: { type: mongoose.Types.ObjectId, ref: "List", required: true },
        detail: {
            completed: { type: Boolean, default: false },
            dueDate: { type: Date }
        }
    },
    { timestamps: true })

const Item = mongoose.model("Item", itemSchema)
export default Item