pragma solidity ^0.4.16;

contract Wager {
    address public bookie;

    enum State {
        Open,
        Closed,
        PaidOut
    }

    struct Bet {
        address bettor;
        address team;
        uint amount;
    }

    State public state = State.Open; // initialize on create
    int currentLine;
    address teamHome;
    address teamAway;
    Bet[] bets;

    modifier isBookie() {
        require(msg.sender == bookie);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    function Wager(address _teamHome, address _teamAway, int line)
    public {
        bookie = msg.sender;
        teamHome = _teamHome;
        teamAway = _teamAway;
        currentLine = line;
    }

    function placeBet(address bettor, address team)
    public
    isBookie()
    inState(State.Open)
    payable
    {
        // check if team is valid
        bets.push(
            Bet({
                bettor: bettor,
                team: team,
                amount: msg.value,
            })
        );
    }
}
