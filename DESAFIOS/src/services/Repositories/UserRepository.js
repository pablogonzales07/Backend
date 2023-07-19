
export default class UserRespository{
    constructor(dao) {
        this.dao = dao
    }

    getAllUsers = () => {
        return this.dao.get()
    }

    getUserBy = (fieldUser) => {
        return this.dao.getBy(fieldUser)
    }

    addUser = (user) => {
        return this.dao.add(user)
    }

    deleteUser = (userId) => {
        return this.dao.delete(userId)
    }

    updateUser = (userId, user) => {
        return this.dao.update(userId, user)
    }

    changeUserPassword = (userEmail, userPass) => {
        return this.dao.changePassword(userEmail, userPass)
    }

}