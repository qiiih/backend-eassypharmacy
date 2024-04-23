class UserPostgres {
    constructor(db) {
        this.User = db.User;
    }

    async createUser(user) {
        try {
            await User.create({
                username: user.username,
                email: user.email,
                'phoneNumber': user.phoneNumber,
                password: user.password,
            })
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findOne({ where: { id: userId, deletedAt: null } })
            return user
        } catch (error) {
            throw error
        }
    }
}

module.exports = { UserPostgres };