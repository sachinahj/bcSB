pragma solidity ^0.4.16;

contract Team {
    address public bookie;
    string public name;

    modifier isBookie() {
        require(msg.sender == bookie);
        _;
    }

    function Team(string _name)
    public
    {
        bookie = msg.sender;
        name = _name;
    }

    function kill()
    public
    isBookie()
    {
        selfdestruct(bookie);
    }
}
