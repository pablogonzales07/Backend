
export default class MainDataDTO {
    static getFrom = (user) => {
        return {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email ,
            role:  user.role
        }
    }
}