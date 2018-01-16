const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

const instream = fs.createReadStream('products.csv');
const rl = readline.createInterface(instream, null);

const products = new Array(20000);
var count = 0;

rl.on('line', function(line) {
  var lineArr = [];
  let productInfo = line.split(',');
  let price = Number(productInfo[1]);
  let volume = Number(productInfo[2]) * Number(productInfo[3]) * Number(productInfo[4])
  let product = {
    productID: Number(productInfo[0]),
    price,
    volume,
    weight: Number(productInfo[5]),
    valuePerCMCube: price/volume
  }
  products[count] = product;
  count++;
});

function findMaxValue(products, maxVolume) {
  let volume = 0;
  let value = 0;
  let productIDSum = 0;
  let pickedProducts = [];

  for (var i=0; i<products.length; i++) {
    if (products[i].volume + volume <= maxVolume) {
      pickedProducts.push(products[i]);
      volume += products[i].volume;
      value += products[i].price;
      productIDSum += products[i].productID;
    }
    if (products[i].volume + volume === maxVolume) {
      break;
    }
  }
  return {
    productIDSum,
    value,
    pickedProducts,
    volume
  }
}

rl.on('close', function() {
  products.sort((x,y) => y.valuePerCMCube - x.valuePerCMCube);
  let result = findMaxValue(products, 45 * 30 * 35);
  console.log(`Product ID Sum = ${result.productIDSum} - Total value = ${result.value} - Volume = ${result.volume}`);
  //console.log(products);
});
