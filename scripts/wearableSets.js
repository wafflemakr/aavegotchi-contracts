/* global ethers */

// Rarity bonus
// nrg
// agg
// spk
// brn

const wearableSetArrays = [
  // 0, camo infantry
  {
    name: 'Infantry',
    wearableIds: [1, 2, 3],
    traitsBonuses: [1, 0, 1, 0, 0]
  },
  // 1, snow trooper
  {
    name: 'Trooper',
    wearableIds: [4, 5, 6],
    traitsBonuses: [2, 0, 1, 0, 0]
  },
  // 2, sergeant marine
  {
    name: 'Sergeant',
    wearableIds: [7, 8, 9],
    traitsBonuses: [3, 0, 2, 0, 0]
  },
  // 3, General
  {
    name: 'General',
    wearableIds: [10, 11, 12],
    traitsBonuses: [4, 0, 2, 0, 0]
  },
  // 3, Mythical Sergey
  {
    name: 'Mythical Sergey',
    wearableIds: [13, 14, 15],
    traitsBonuses: [5, 0, 3, 0, 0]
  },
  // 4, Godlike Sergey
  {
    name: 'Godlike Sergey',
    wearableIds: [13, 14, 16],
    traitsBonuses: [6, 0, 3, 0, 0]
  },
  // 4, Apex Sergey
  {
    name: 'Apex Sergey',
    wearableIds: [13, 14, 16, 17],
    traitsBonuses: [8, 2, 3, 0, 0]
  }

]

function sixteenBitArrayToUint (array) {
  const uint = []
  for (let item of array) {
    if (typeof item === 'string') {
      item = parseInt(item)
    }
    uint.push(item.toString(16).padStart(4, '0'))
  }
  // console.log(uint.join(''))
  return ethers.BigNumber.from('0x' + uint.join(''))
}
const wearableSets = []
for (const wearableSet of wearableSetArrays) {
  wearableSets.push([
    wearableSet.name,
    sixteenBitArrayToUint(wearableSet.wearableIds),
    sixteenBitArrayToUint(wearableSet.traitsBonuses)
  ])
}

exports.wearableSets = wearableSets
