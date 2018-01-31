pragma solidity ^0.4.16;

import "./Team.sol";

contract Teams {
    address public bookie;
    address[] public teams;

    modifier isBookie() {
        if (msg.sender != bookie) return;
        _;
    }

    function Teams(address[] _teams)
    public
    {
        teams = _teams;
        bookie = msg.sender;
    }

    function addTeam(address _team)
    public
    isBookie()
    {
        teams.push(_team);
    }

    function kill()
    public
    isBookie()
    {
        selfdestruct(bookie);
    }
}
