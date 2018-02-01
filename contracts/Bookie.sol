pragma solidity ^0.4.16;

import "./Team.sol";
import "./Wager.sol";

contract Bookie {
    address public owner;
    Team[] public teams;
    mapping (address => Wager) public wagers;


    modifier isOwner() {
        require(msg.sender == owner);
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
        teams.push(team);
    }

    function createWager(address teamHome, address teamAway, int line)
    public
    isOwner()
    {
        Wager wager = new Wager(teamHome, teamAway, line);
        wagers[wager] = wager;
    }

    function placeBet(address wager, address team, uint amount)
    public
    payable
    {
        wagers[wager].placeBet.value(msg.value)(msg.sender, team, amount);
    }

    function kill()
    public
    isOwner()
    {
        // kill wagers
        // kill teams
        selfdestruct(owner);
    }
}
