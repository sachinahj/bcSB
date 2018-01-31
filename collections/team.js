'use strict'

class Team {
    constructor(address, name) {
        this.address = address;
        this.name = name;
    }

    static createTeam(name) {
        const address = webbie.createContract("Team", name);
        const team = new Team(address, name);
        return team
    }
}

module.exports = Team;
