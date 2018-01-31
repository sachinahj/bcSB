pragma solidity ^0.4.16;

contract Team {
    address public bookie;
    string public name;

    function Team(string _name) public {
        name = _name;
        bookie = msg.sender;
    }

    function kill() public {
        selfdestruct(bookie);
    }
}

contract Teams {

}
