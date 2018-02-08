pragma solidity ^0.4.16;

import "./Team.sol";
import "./Wager.sol";

contract Bookie {
    address public owner;
    mapping (address => Team) public teams;
    mapping (address => Wager) public wagers;

    event LogBookieInitialized(address owner, address bookie);
    event LogTeamCreated(address team, string name);
    event LogWagerCreated(address wager, address teamHome, address teamAway);
    event LogBetPlaced(address bettor, address wager, address team, uint amount);
    event LogBookieKilled(address sender, address owner);

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function Bookie()
    public
    payable
    {
        owner = msg.sender;
        LogBookieInitialized(owner, this);
    }

    function createTeam(string name)
    public
    isOwner()
    {
        Team team = new Team(name);
        teams[team] = team;
        LogTeamCreated(team, name);
    }

    function createWager(address teamHome, address teamAway)
    public
    isOwner()
    {
        Wager wager = new Wager(teamHome, teamAway);
        wagers[wager] = wager;
        LogWagerCreated(wager, teamHome, teamAway);
    }

    function placeBet(address wager, address team)
    public
    payable
    {
        wagers[wager].placeBet(msg.sender, team, msg.value);
        LogBetPlaced(msg.sender, wager, team, msg.value);
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
