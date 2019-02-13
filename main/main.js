const {loadPromotions,loadAllItems} = require('./datbase');
function printInventory(inputs) {
    let specialItems=getSpecialItems();



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

function getProperty(barcode,propertyName){
    let allItems=loadAllItems();
    for(let i in allItems){
        let curItem=allItems[i];
        if (curItem.barcode===barcode){
            return curItem[propertyName]
        }
    }
}

module.exports = {
    printInventory: printInventory,
    getSpecialItems: getSpecialItems,
    getProperty:getProperty
};