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

contract   Summer {
    
    
    uint public eventsLength = 0;
    address internal cUsdTokenAddress = 
    0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;



     struct  Event {
        address payable owner;
        string image;
        string theme;
        string venue;
        uint price;
        uint interested;
      
          
      mapping(address => bool) hasShownInterest;

   }

    mapping (uint =>  Event) internal events;

    function  addEvent(
        string memory _image, 
        string memory _theme,
         string memory _venue,
         uint _price
        

          ) public {
       Event storage Eventt = events[eventsLength];


           Eventt.owner = payable(msg.sender);
            Eventt.image = _image;
             Eventt.theme = _theme;
            Eventt.venue = _venue;
            Eventt.price = _price;
            


  
        eventsLength++;
          }


           function getEvent(uint _index) public view returns (
        address payable,
        string memory,  
        string memory, 
        string memory,
        uint,
        uint,
        bool

             
    ) {
        return (  
            events[_index].owner,
             events[_index].image,
              events[_index].theme,
               events[_index].venue,
                events[_index].price,
               events[_index].interested,
                events[_index].hasShownInterest[msg.sender]
               
        );
}

 function Interested(uint _index)public{
        require(events[_index].hasShownInterest[msg.sender] == false, "User only once");
        events[_index].interested++;
        events[_index].hasShownInterest[msg.sender] = true;
        
     }

     
    function ChangeVenue(uint _index, string memory _venue) public {
        require(msg.sender == events[_index].owner, "Only creator can perform this operation");
        events[_index].venue = _venue;
    }

     function geteventsLength() public view returns (uint) {
        return (eventsLength);
    }

      function bookEvent(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            events[_index].owner,
            events[_index].price
          ),
          "Transfer failed."
        );

        
         
    }
}


