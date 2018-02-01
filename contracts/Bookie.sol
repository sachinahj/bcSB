pragma solidity ^0.4.16;

import "./Team.sol";
import "./Teams.sol";

contract Bookie {
    address public owner;
    Teams public teams = new Teams();

    modifier isOwner() {
        if (msg.sender != owner) return;
        _;
    }

    function Bookie()
    public
    {
        owner = msg.sender;
    }

    function addTeam(string name)
    public
    isOwner()
    {
        Team team = new Team(name);
        teams.addTeam(team);
    }

    function kill()
    public
    isOwner()
    {
        // kill teams
        selfdestruct(owner);
    }
}
