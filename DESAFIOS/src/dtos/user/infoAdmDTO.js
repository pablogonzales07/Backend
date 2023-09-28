
export default class InfoAdmDTO {
    static getFrom = (user) => {
        return {
            id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email ,
            role:  user.role,
            last_connection: user.last_connection
        }
    }
}

