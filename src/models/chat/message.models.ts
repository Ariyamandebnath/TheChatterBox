import { Schema, Document, model, Types } from "mongoose";

// Define interface for ChatMessage document
interface IChatMessage extends Document {
    sender: Types.ObjectId;
    content: string;
    attachments: { url: string, localPath: string }[];
    chat: Types.ObjectId;
}

// Define chat message schema
const chatMessageSchema = new Schema<IChatMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
    },
    attachments: {
        type: [
            {
                url: String,
                localPath: String,
            },
        ],
        default: [],
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
    },
}, { timestamps: true });

// Create and export ChatMessage model
export const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema);
