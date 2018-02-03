pragma solidity ^0.4.16;

import "./Team.sol";
import "./Wager.sol";

contract Bookie {
    address public owner;
    Team[] public teams;
    mapping (address => Wager) public wagers;

    event LogBookieInitialized(address owner);
    event LogTeamAdded(address team, string name);
    event LogWagerAdded(address wager, address teamHome, address teamAway, int line);
    event LogBookieKilled(address sender, address owner);

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function Bookie()
    public
    {
        owner = msg.sender;
        LogBookieInitialized(owner);
    }

    function addTeam(string name)
    public
    isOwner()
    {
        Team team = new Team(name);
        teams.push(team);
        LogTeamAdded(team, name);
    }

    function createWager(address teamHome, address teamAway, int line)
    public
    isOwner()
    {
        Wager wager = new Wager(teamHome, teamAway, line);
        wagers[wager] = wager;
        LogWagerAdded(wager, teamHome, teamAway, line);
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
        LogBookieKilled(msg.sender, owner);
        selfdestruct(owner);
    }
}
