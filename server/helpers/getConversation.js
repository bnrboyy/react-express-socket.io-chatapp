import Conversation from "../models/ConversationModel.js";

export const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserCon = await Conversation.find({
      $or: [
        {
          sender: currentUserId,
        },
        {
          receiver: currentUserId,
        },
      ],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversations = currentUserCon.map((con) => {
      const countUnseenMsg = con.messages?.reduce((prev, curr) => {
        if (curr?.msgByUserId?.toString() !== currentUserId) {
          return prev + (curr?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);
      // const countUnseenMsg = con.messages?.filter(
      //   (msg) => msg.seen === false
      // ).length;

      return {
        _id: con._id,
        sender: con.sender,
        receiver: con.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: con.messages?.length
          ? con.messages[con.messages.length - 1]
          : null,
        updatedAt: con.updatedAt,
      };
    });

    return conversations;
    // socket.emit("conversations", conversations);
  } else {
    return [];
  }
};