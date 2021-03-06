// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "../libraries/LibAppStorage.sol";
import "../../shared/libraries/LibDiamond.sol";
import "hardhat/console.sol";
import "../../shared/libraries/LibERC20.sol";
import "../interfaces/IERC1155.sol";
import "../libraries/LibERC1155.sol";
import "../libraries/LibVrf.sol";

contract ShopFacet {
    AppStorage internal s;
    event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values);
    bytes4 internal constant ERC1155_BATCH_ACCEPTED = 0xbc197c81; // Return value from `onERC1155BatchReceived` call if a contract accepts receipt (i.e `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`).

     event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    address internal immutable im_vouchersContract;

    constructor(address _vouchersContract) {
        im_vouchersContract = _vouchersContract;
    }


      function buyPortals(
        address _to,
        uint256 _ghst,
        bool _setBatchId
    ) external {
        uint256 currentHauntId = s.currentHauntId;
        Haunt memory haunt = s.haunts[currentHauntId];
        require(_ghst >= haunt.portalPrice, "AavegotchiFacet: Not enough GHST to buy portal");
        uint256 ghstBalance = IERC20(s.ghstContract).balanceOf(msg.sender);
        require(ghstBalance >= _ghst, "AavegotchiFacet: Not enough GHST!");
        uint16 hauntId = s.currentHauntId;
        uint256 numAavegotchisToPurchase = _ghst / haunt.portalPrice;
        uint256 hauntCount = haunt.totalCount + numAavegotchisToPurchase;
        require(hauntCount <= haunt.hauntMaxSize, "AavegotchiFacet: Exceeded max number of aavegotchis for this haunt");
        s.haunts[currentHauntId].totalCount = uint24(hauntCount);
        uint32 nextBatchId;
        LibVrf.Storage storage vrf_ds = LibVrf.diamondStorage();
        if (_setBatchId) {
            nextBatchId = vrf_ds.nextBatchId;
        }
        uint256 tokenId = s.totalSupply;
        for (uint256 i; i < numAavegotchisToPurchase; i++) {
            s.aavegotchis[tokenId].owner = _to;
            s.aavegotchis[tokenId].batchId = nextBatchId;
            s.aavegotchis[tokenId].hauntId = hauntId;
            emit Transfer(address(0), _to, tokenId);
            tokenId++;
        }
        if (_setBatchId) {
            vrf_ds.batchCount += uint32(numAavegotchisToPurchase);
        }
        s.aavegotchiBalance[_to] += numAavegotchisToPurchase;
        s.totalSupply = uint32(tokenId);

        uint256 totalPrice = _ghst - (_ghst % haunt.portalPrice);

        LibAppStorage.purchase(totalPrice);
    }



    function purchaseItemsWithGhst(
        address _to,
        uint256[] calldata _itemIds,
        uint256[] calldata _quantities
    ) external {
        require(_itemIds.length == _quantities.length, "ShopFacet: _itemIds not same length as _quantities");

        uint256 totalPrice;
        for (uint256 i; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            uint256 quantity = _quantities[i];
            ItemType storage itemType = s.itemTypes[itemId];
            require(itemType.canPurchaseWithGhst, "ShopFacet: Can't purchase item type with GHST");
            uint256 totalQuantity = itemType.totalQuantity + quantity;
            require(totalQuantity <= itemType.maxQuantity, "ShopFacet: Total item type quantity exceeds max quantity");
            itemType.totalQuantity = uint32(totalQuantity);
            totalPrice += quantity * itemType.ghstPrice;
            s.items[_to][itemId] += quantity;
        }

        LibERC1155.onERC1155BatchReceived(msg.sender, _to, _itemIds, _quantities, "");
        uint256 ghstBalance = IERC20(s.ghstContract).balanceOf(msg.sender);
        require(ghstBalance >= totalPrice, "ShopFacet: Not enough GHST!");

        LibAppStorage.purchase(totalPrice);
    }

    //Burn the voucher
    //Mint the wearable and transfer to user
    function purchaseItemsWithVouchers(
        address _to,
        uint256[] calldata _voucherIds,
        uint256[] calldata _quantities
    ) external {
        IERC1155(im_vouchersContract).safeBatchTransferFrom(msg.sender, address(this), _voucherIds, _quantities, "");
        require(_voucherIds.length == _quantities.length, "ShopFacet: _voucherIds not same length as _quantities");
        for (uint256 i; i < _voucherIds.length; i++) {
            //Item types start at ID 1, but vouchers start at ID 0
            uint256 itemId = _voucherIds[i] + 1;
            uint256 quantity = _quantities[i];
            uint256 totalQuantity = s.itemTypes[itemId].totalQuantity + quantity;
            require(totalQuantity <= s.itemTypes[itemId].maxQuantity, "ShopFacet: Total item type quantity exceeds max quantity");
            s.items[_to][itemId] += quantity;
            s.itemTypes[itemId].totalQuantity = uint32(totalQuantity);
        }
        LibERC1155.onERC1155BatchReceived(msg.sender, _to, _voucherIds, _quantities, "");
    }

    /**
        @notice Handle the receipt of multiple ERC1155 token types.
        @dev An ERC1155-compliant smart contract MUST call this function on the token recipient contract, at the end of a `safeBatchTransferFrom` after the balances have been updated.        
        This function MUST return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` (i.e. 0xbc197c81) if it accepts the transfer(s).
        This function MUST revert if it rejects the transfer(s).
        Return of any other value than the prescribed keccak256 generated value MUST result in the transaction being reverted by the caller.
        @param _operator  The address which initiated the batch transfer (i.e. msg.sender)
        @param _from      The address which previously owned the token
        @param _ids       An array containing ids of each token being transferred (order and length must match _values array)
        @param _values    An array containing amounts of each token being transferred (order and length must match _ids array)
        @param _data      Additional data with no specified format
        @return           `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
    */
    function onERC1155BatchReceived(
        address _operator,
        address _from,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external view returns (bytes4) {
        // placed here to prevent argument not used errors
        _operator;
        _from;
        _ids;
        _values;
        _data;
        require(msg.sender == im_vouchersContract, "ShopFacet: Only accepts ERC1155 tokens from VoucherContract");
        require(_ids.length > 0, "ShopFacet: Can't receive 0 vouchers");
        return ERC1155_BATCH_ACCEPTED;
    }
}
