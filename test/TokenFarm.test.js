const { assert } = require('chai')

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai').use(require('chai-as-promised')).should()
function token(n){
  return web3.utils.toWei(n, 'Ether')
}
contract ('TokenFarm', async([owner,investor])=>{
  let daiToken,dappToken,tokenFarm
  before(async()=>{
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address,daiToken.address)
    await dappToken.transfer(tokenFarm.address,token('1000000'))
    await daiToken.transfer(investor, token('100'), { from: owner})

  })
describe('Mock Dai Deploying',async()=>{

  it('has a name', async()=>{
         assert.equal(await daiToken.name(), 'Mock DAI Token')
  
        })     
})
  describe('Mock DappToken Deploying', async () => {

    it('has a name', async () => {
      assert.equal(await dappToken.name(), 'Muzammil Token')
    })
    it('contract has token', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(await balance.toString(), token('1000000'))
    })
  })
  describe('farming Token',async()=>{
    it('rewaard user',async()=>{
      let result 
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(),token('100'),'investor balance correct!!!!!')
   //staking token
      await daiToken.approve(tokenFarm.address,token('100'), { from: investor })   
     await tokenFarm.stakeToken(token('100'),{from:investor})
   
     result = await daiToken.balanceOf(investor)
    assert.equal(result.toString(),token('0'),'investor dai wallet is incorrect')
    
      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), token('100'), 'tokenFarm dai wallet is incorrect')
     
      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), token('100'), 'investor staking balance correct staking')
      
      result = await tokenFarm.isStaked(investor)
      assert.equal(result.toString(), 'true', 'tokenFarm dai wallet is incorrect')
   
      await tokenFarm.issueToken({from: owner})
      result = await dappToken.balanceOf(investor)
      assert.equal(result.toString(),token('100'),'staking reward send to investor')
  
await tokenFarm.unStakeToken({from:investor})
result = await daiToken.balanceOf(investor)
assert.equal(result.toString(),token('100'),'Token not transfered completely')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), token('0'), 'Token not transfered completely from tokenFarm')
})
  })
})