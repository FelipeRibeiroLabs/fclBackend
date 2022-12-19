// This is an example implementation of a Flow Non-Fungible Token
// It is not part of the official standard but it assumed to be
// very similar to how many NFTs would implement the core functionality.
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20


pub contract Orbies: NonFungibleToken {

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub struct NFTMetaData {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let thumbnail: String
        pub let type: String

        init(_id: UInt64, _name: String, _description: String, _thumbnail: String, _type: String) {
            self.id = _id
            self.name = _name
            self.description = _description
            self.thumbnail = _thumbnail
            self.type = _type
        }
    }

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let thumbnail: String
        pub let type: String

        init( name: String, description: String, thumbnail: String, type: String) {
            self.id = self.uuid
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.type = type

            Orbies.totalSupply = Orbies.totalSupply + 1
        }
    
        pub fun getViews(): [Type] {
            return [ Type<MetadataViews.Display>(), Type<NFTMetaData>()]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
                        thumbnail: MetadataViews.HTTPFile( url: self.thumbnail )
                    )
                case Type<NFTMetaData>():
                return NFTMetaData(
                    _id: self.id,
                    _name: self.name,
                    _description: self.description,
                    _thumbnail: self.thumbnail,
                    _type: self.type
                )
            }
            return nil
        }

    }

    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () { self.ownedNFTs <- {} }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Orbies.NFT

            let id: UInt64 = token.uuid

            // add the new token to the dictionary which removes the old one
            self.ownedNFTs[id] <-! token

            emit Deposit(id: id, to: self.owner?.address)
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] { return self.ownedNFTs.keys }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT { 
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)! 
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let orbies = nft as! &Orbies.NFT
            return orbies as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource NFTMinter {
        pub fun mintNFT(
                recipient: &Orbies.Collection{NonFungibleToken.CollectionPublic},
                name: String, description: String, thumbnail: String, type: String) {

                var newNFT <- create NFT( name: name, description: description, thumbnail: thumbnail, type: type )

                // deposit it in the recipient's account using their reference
                recipient.deposit(token: <-newNFT)
            }
	}

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/OrbiesCollection
        self.CollectionPublicPath = /public/OrbiesCollection
        self.MinterStoragePath = /storage/myGalleryCollectionMinter

        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}