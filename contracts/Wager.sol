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
    payable
    {
        // require team is valid?
        bets.push(
            Bet({
                bettor: bettor,
                team: team,
                amount: amount
            })
        );
    }

    function payOut(address winningTeam)
    public
    isBookie()
    inState(State.Open)
    {
        // require winningTeam is valid?
        for (uint i = 0; i < bets.length; i++) {
          if (bets[i].team == winningTeam) {
            bets[i].bettor.transfer(bets[i].amount * 2);
          } else {
            bookie.transfer(bets[i].amount * 2);
          }
        }
        // state = State.PaidOut;
    }
}
