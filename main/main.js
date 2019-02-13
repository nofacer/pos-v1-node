const {loadPromotions, loadAllItems} = require('./datbase');

function printInventory(inputs) {
    let specialItems = getSpecialItems();


    return 'Hello World!';
};

function getSpecialItems() {
    let promotions = loadPromotions();
    for (let i in promotions) {
        let curPromotion = promotions[i];
        if (curPromotion.type === "BUY_TWO_GET_ONE_FREE") {
            return curPromotion.barcodes
        }
    }

}

function getProperty(barcode, propertyName) {
    let allItems = loadAllItems();
    for (let i in allItems) {
        let curItem = allItems[i];
        if (curItem.barcode === barcode) {
            return curItem[propertyName]
        }
    }
}

function getAmount(singleInput) {
    let splitedInput = singleInput.split('-');
    if (splitedInput.length <= 1) {
        return [singleInput, 1]
    } else {
        return [splitedInput[0], parseInt(splitedInput[1])]
    }
}

function calTotalAmount(inputs) {
    let totalAmount = {};
    for (let i in inputs) {
        let curInput = inputs[i];
        let curAmount = getAmount(curInput);
        if (totalAmount.hasOwnProperty(curAmount[0])) {
            totalAmount[curAmount[0]] += curAmount[1];
        } else {
            totalAmount[curAmount[0]] = curAmount[1];
        }
    }
    return totalAmount
}

function calDiscount(totalAmount) {
    let discount={};
    let specialItems = getSpecialItems();
    for (let key in totalAmount) {
        let curItem = key;
        let curAmount = totalAmount[key];
        if(specialItems.indexOf(curItem) > -1){
            if(curAmount>=2){
                discount[curItem]=1;
            }
        }

    }
    return discount
}

module.exports = {
    printInventory: printInventory,
    getSpecialItems: getSpecialItems,
    getProperty: getProperty,
    getAmount: getAmount,
    calTotalAmount: calTotalAmount,
    calDiscount:calDiscount
};