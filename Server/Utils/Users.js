class User{
    constructor(){
        this.users = []
    }

    addUser(id, name, room){
        let user = {id, name, room}
        this.users.push(user);

        return user;
    }
    
    getUserList(room){
        let users = this.users.filter((user) => user.room === room);
        let namesArray = users.map((user) => user.name);

        return namesArray;
    }

    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }

    removeUser(id){
        let user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    updateUserList(id, name, room){
        let user = this.getUser(id);
        if(user){
            //this.removeUser(id);
            user = this.addUser(id, name, room);
        }

        return user;
    }
}

module.exports = {User}