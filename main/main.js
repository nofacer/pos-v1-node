const {loadPromotions, loadAllItems} = require('./datbase');

function printInventory(inputs) {
    let text = "";
    let totalAmount = calTotalAmount(inputs);
    let discount = calDiscount(totalAmount);
    let finalCost = calFinalCost(totalAmount, discount);

    text += "***<没钱赚商店>购物清单***\n";
    //First part
    for (let key in finalCost['items']) {
        let curItem = finalCost['items'][key];
        text += '名称：' + curItem.name + '，数量：' +
            curItem.amount + curItem.unit + '，单价：' +
            curItem.price.toFixed(2) + '(元)，小计：' + curItem.totalCost.toFixed(2) + '(元)\n'
    }
    text += '----------------------\n';
    //Second part if there is discount
    if (finalCost['discountValue'] > 0) {
        text += '挥泪赠送商品：\n';
        for (let key in finalCost['discountItems']) {
            let curItem = finalCost['discountItems'][key];
            text += '名称：' + curItem.name + '，数量：' + curItem.disAmount + curItem.unit + '\n';
        }
        text += '----------------------\n';
    }
    //Third part
    text += '总计：' + finalCost['needToPay'].toFixed(2) + '(元)\n';
    text += '节省：' + finalCost['discountValue'].toFixed(2) + '(元)\n';
    text+='**********************';
    console.log(text)

    return 6;
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
    let discount = {};
    let specialItems = getSpecialItems();
    for (let key in totalAmount) {
        let curItem = key;
        let curAmount = totalAmount[key];
        if (specialItems.indexOf(curItem) > -1) {
            if (curAmount >= 2) {
                discount[curItem] = 1;
            }
        }
    }
    return discount
}

function calFinalCost(totalAmount, discount) {
    let finalCost = {'items': {}, 'discountItems': {}, 'needToPay': 0, 'discountValue': 0};
    for (let key in totalAmount) {
        let curItem = key;
        let curName = getProperty(curItem, 'name');
        let curAmount = totalAmount[key];
        let curUnit = getProperty(curItem, 'unit');
        let curPrice = getProperty(curItem, 'price');
        let curDiscount = 0;
        if (discount.hasOwnProperty(curItem)) {
            curDiscount = discount[curItem];
            finalCost['discountItems'][key] = {'name': curName, 'disAmount': curDiscount, 'unit': curUnit};
            finalCost['discountValue'] += curDiscount * curPrice;
        }
        let curCost = (curAmount - curDiscount) * curPrice;
        finalCost['needToPay'] += curCost;
        finalCost['items'][key] = {
            'name': curName,
            'amount': curAmount,
            'unit': curUnit,
            'price': curPrice,
            'totalCost': curCost
        };
    }
    return finalCost;

}

module.exports = {
    printInventory: printInventory,
    getSpecialItems: getSpecialItems,
    getProperty: getProperty,
    getAmount: getAmount,
    calTotalAmount: calTotalAmount,
    calDiscount: calDiscount,
    calFinalCost: calFinalCost
};