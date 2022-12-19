export const mintOrbies = `
import Orbies from 0x2646896ede3e5811
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import MetadataViews from 0x631e88ae7f1d7c20

transaction( name: String, description: String, thumbnail: String, type: String) {
  let recipientCollection: &Orbies.Collection{NonFungibleToken.CollectionPublic}
  let flowTokenReceiver: &FlowToken.Vault{FungibleToken.Receiver}
  let temporaryVault: @FungibleToken.Vault
  let adminMinter: &Orbies.NFTMinter

  prepare(signer: AuthAccount, admin: AuthAccount) {

    self.adminMinter = admin.borrow<&Orbies.NFTMinter>(from: Orbies.MinterStoragePath)!

    let paymentReceiverAcct = getAccount(admin.address)
    let receiverCap = paymentReceiverAcct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    self.flowTokenReceiver = receiverCap.borrow()!

    //SETUP EXAMPLE NFT COLLECTION
    if signer.borrow<&Orbies.Collection>(from: Orbies.CollectionStoragePath) == nil {
      signer.save(<- Orbies.createEmptyCollection(), to: Orbies.CollectionStoragePath)
      signer.link<&Orbies.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(Orbies.CollectionPublicPath, target: Orbies.CollectionStoragePath)
    }

    self.recipientCollection = signer.getCapability(Orbies.CollectionPublicPath)
                                .borrow<&Orbies.Collection{NonFungibleToken.CollectionPublic}>()!
  
    let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow owner''s Vault reference")
    
    var price = 0.0
    switch type {
      case "common" as String:
        price = UFix64(10)
      case "rare" as String:
        price = UFix64(30)
      case "legendary" as String:
        price = UFix64(50)
    }

    self.temporaryVault <- vaultRef.withdraw(amount: price)  
  }
  
  
  execute {
    self.flowTokenReceiver.deposit(from: <- self.temporaryVault)
    self.adminMinter.mintNFT(recipient: self.recipientCollection, name: name, description: description, thumbnail: thumbnail, type: type)
  }
}
`