pragma solidity ^0.4.16;

contract Team {
    address public bookie;
    string public name;

    modifier isBookie() {
        if (msg.sender != bookie) return;
        _;
    }

    function Team(string _name)
    public
    {
        name = _name;
        bookie = msg.sender;
    }

    function kill()
    public
    isBookie()
    {
        selfdestruct(bookie);
    }
}
