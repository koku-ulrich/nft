pragma solidity >=0.4.21 <0.6.0;

import '@openzeppelin/contracts/token/ERC721/ERC721Full.sol';

contract Maison is ERC721Full {

  string[] public maisons;
  mapping(string => bool) _maisonExists;

  constructor() ERC721Full("Color", "COLOR") public {
  }

  // E.G. color = "#FFFFFF"
  function createMaison(string memory _image) public {
    require(!_maisonExists[_image]);
    uint _id = maisons.push(_image);
    _mint(msg.sender, _id);
    _maisonExists[_image] = true;
  }


}
