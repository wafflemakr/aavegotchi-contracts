# Aavegotchi Diamonds

## Contract Addresses

Kovan:

- Aavegotchi diamond: 0xF70406a9a17d8262E6de256D51cAF58Af8BBa8A2
- GHST diamond: 0xeDaA788Ee96a0749a2De48738f5dF0AA88E99ab5

The ABI files for the diamonds are in the artifacts directory:

1. IAavegotchiDiamond.json
1. IGHSTDiamond.json

To easily see what functions these ABI files provide check the corresponding files in the contracts/interfaces directory:

1. IAavegotchiDiamond.sol
1. IGHSTDiamond.sol

Using a diamond ABI should look something like this:

```javascript
let aavegotchiDiamond = new web3.eth.Contract(
  JSON.parse(jsonfromfile).abi,
  aavegotchiDiamondAddress
);
```

## Deployment

```console
npx buidler run scripts/deploy.js
```
