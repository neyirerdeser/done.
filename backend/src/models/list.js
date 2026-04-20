import mongoose from "mongoose"

const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    items: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
    creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    iconName: { type: String, default: "List" },
})

const List = mongoose.model("List", listSchema)
export default List