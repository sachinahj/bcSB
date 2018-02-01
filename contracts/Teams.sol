pragma solidity ^0.4.16;

import "./Team.sol";

contract Teams {
    address public bookie;
    address[] public teams;

    modifier isBookie() {
        if (msg.sender != bookie) return;
        _;
    }

    function Teams()
    public
    {
        bookie = msg.sender;
    }

    function addTeam(address team)
    public
    isBookie()
    {
        teams.push(team);
    }

    function kill()
    public
    isBookie()
    {
        // iterate and kill each team
        selfdestruct(bookie);
    }
}
