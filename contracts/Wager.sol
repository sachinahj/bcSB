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
        uint amount;
        int line;
    }

    State public state = State.Open; // initialize on create
    int currentLine;
    string teamHome;
    string teamAway;
    Bet[] bets;

    modifier inState(State _state) {
        if (state != _state) return;
        _;
    }

    function Wager(string _teamHome, string _teamAway, int line) public {
        bookie = msg.sender;
        teamHome = _teamHome;
        teamAway = _teamAway;
        currentLine = line;
    }

    function placeBet(string team) public inState(State.Open) payable {
        require(keccak256(team) == keccak256(teamHome) || keccak256(team) == keccak256(teamAway));
        bets.push(
            Bet({
                bettor: msg.sender,
                amount: msg.value,
                line: currentLine
            })
        );
    }
}
