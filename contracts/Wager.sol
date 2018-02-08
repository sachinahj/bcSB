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
    address public teamHome;
    address public teamAway;
    Bet[] public bets;

    modifier isBookie() {
        require(msg.sender == bookie);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    function Wager(address _teamHome, address _teamAway)
    public {
        bookie = msg.sender;
        teamHome = _teamHome;
        teamAway = _teamAway;
    }

    function placeBet(address bettor, address team, uint amount)
    public
    isBookie()
    inState(State.Open)
    {
        // check if team is valid
        bets.push(
            Bet({
                bettor: bettor,
                team: team,
                amount: amount
            })
        );
    }
}
