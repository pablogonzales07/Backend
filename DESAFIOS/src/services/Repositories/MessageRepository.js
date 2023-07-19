
export default class MessageRepository {
    constructor(dao) {
        this.dao = dao
    }

    getMessages = (params) => {
        return this.dao.get(params)
    }

    addMessage = (message) => {
        return this.dao.add(message)
    }
    
}