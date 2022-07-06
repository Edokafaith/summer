// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Summer {
    uint256 public eventsLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Event {
        address payable owner;
        string image;
        string theme;
        string venue;
        uint256 price;
        uint256 interested;
    }

    mapping(uint256 => Event) internal events;
    // keeps track of Events state, whether they have already ended or not
    mapping(uint256 => bool) private over;
    // keeps track of users that have shown interest in a specific event
    mapping(uint256 => mapping(address => bool)) private shownInterest;
    // keeps track of users that have booked an event
    mapping(uint256 => mapping(address => bool)) private booked;


    event EventAdded(uint _index, address owner);
    event EventEnded(uint _index, uint Interested);
    event Booked(uint _index, address user, bool didBook);
    event Interest(uint _index, address user, bool interest);

    // checks that event isn't over
    modifier isOver(uint256 _index) {
        require(!over[_index], "Already ended");
        _;
    }
    // creates an event
    function addEvent(
        string memory _image,
        string memory _theme,
        string memory _venue,
        uint256 _price
    ) public {
        require(_price > 0, "Invalid price");
        require(bytes(_image).length > 0, "Invalid image url");
        require(bytes(_theme).length > 0, "Empty theme");
        require(bytes(_venue).length > 0, "Invalid venue");
        uint256 id = eventsLength;
        eventsLength++;
        events[eventsLength] = Event(
            payable(msg.sender),
            _image,
            _theme,
            _venue,
            _price,
            0
        );
        over[id] = false;
        emit EventAdded(id, msg.sender);
    }

    function getEvent(uint256 _index)
        public
        view
        isOver(_index)
        returns (Event memory, bool)
    {
        return (events[_index], shownInterest[_index][msg.sender]);
    }
    // ends an event and end access to all related functions for specific event
    function endEvent(uint256 _index) public isOver(_index) {
        require(events[_index].owner == msg.sender, "Unauthorized user");
        over[_index] = true;
        uint interests = events[_index].interested;
        delete events[_index];
        emit EventEnded(_index, interests);
    }


    // saves interest to an event
    function Interested(uint256 _index) public isOver(_index) {
        require(
            shownInterest[_index][msg.sender] == false,
            "You have already shown interest in this event"
        );
        events[_index].interested++;
        shownInterest[_index][msg.sender] = true;
        emit Interest(_index, msg.sender, true);
    }
    // removes interest from an event
    function unInterested(uint256 _index) public isOver(_index) {
        require(
            shownInterest[_index][msg.sender] == true,
            "You haven't shown interest in this event"
        );
        events[_index].interested--;
        shownInterest[_index][msg.sender] = false;
        emit Interest(_index, msg.sender, false);
    }
    // allows the event owner to change the venue
    function ChangeVenue(uint256 _index, string memory _venue)
        public
        isOver(_index)
    {
        require(
            msg.sender == events[_index].owner,
            "Only creator can perform this operation"
        );
        require(bytes(_venue).length > 0, "Invalid venue");
        events[_index].venue = _venue;
    }

    function geteventsLength() public view returns (uint256) {
        return (eventsLength);
    }
    // allows d user to book an event
    function bookEvent(uint256 _index) public payable isOver(_index) {
        require(
            msg.sender != events[_index].owner,
            "Creator can't book his own event"
        );
        require(!booked[_index][msg.sender], "Already booked event");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                events[_index].owner,
                events[_index].price
            ),
            "Transfer failed."
        );

        booked[_index][msg.sender] = true;
        emit Booked(_index, msg.sender, true);
    }
    // allows a user to unbook an event
    function unBookEvent(uint256 _index) public isOver(_index) {
        require(
            booked[_index][msg.sender],
            "You are not booked for this event"
        );
        booked[_index][msg.sender] = false;
        emit Booked(_index, msg.sender, false);
    }
}
