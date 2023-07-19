import messageModel from "../models/message.js";

export default class MessagesManager {
  //Method to get messages
  get= (params) => {
    return messageModel.find(params).lean();
  };

  //Method to add a new message
  add = (message) => {
    return messageModel.create(message);
  };
}
