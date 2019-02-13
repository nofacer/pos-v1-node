const {loadPromotions} = require('./datbase');
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

module.exports = {
    printInventory: printInventory,
    getSpecialItems: getSpecialItems
};