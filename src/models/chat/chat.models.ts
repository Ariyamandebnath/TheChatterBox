import { Schema, Document, model, Types } from "mongoose";

// Define interface for Chat document
interface IChat extends Document {
    name: string;
    isGroupChat: boolean;
    lastMessage: Types.ObjectId | null;
    participants: Types.ObjectId[];
    admin: Types.ObjectId | null;
}

// Define chat schema
const chatSchema = new Schema<IChat>({
    name: {
        type: String,
        required: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "ChatMessage",
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
});

// Create and export Chat model
export const Chat = model<IChat>("Chat", chatSchema);
