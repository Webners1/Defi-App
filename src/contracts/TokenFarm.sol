pragma solidity >=0.4.21 <0.9.0;
import './DappToken.sol';
import './DaiToken.sol';
contract TokenFarm{
string public name='MuzammilTokenFarm';
DappToken public dappToken;
DaiToken public daiToken;
address public owner;
mapping(address => uint) public stakingBalance;
mapping(address => bool) public isStaked;
mapping(address => bool) public hasStaked;
address[] public stakers;
constructor(DappToken _dappToken,DaiToken _daiToken) public {
 dappToken = _dappToken;
 daiToken = _daiToken;
}
function stakeToken(uint _amount)public payable{
       require(_amount>0,'amount cant be 0 or less');
daiToken.transferFrom(msg.sender, address(this), _amount);
stakingBalance[msg.sender] += _amount;
//adding to the Stake
if(!hasStaked[msg.sender]){
       stakers.push(msg.sender);
}
//staking
isStaked[msg.sender] = true;
hasStaked[msg.sender] = true;
}
function issueToken()public{
  for(uint i=0;i<stakers.length;i++){
       address recepient = stakers[i];
       uint balance = stakingBalance[recepient];
  if(balance>0){
  dappToken.transfer(recepient, balance);
  }
  }     
}
function unStakeToken()public{
       uint balance= stakingBalance[msg.sender];
       require(balance >0,'balance is 0');
daiToken.transfer(msg.sender, balance);
stakingBalance[msg.sender] = 0;
isStaked[msg.sender] = false;
}
}