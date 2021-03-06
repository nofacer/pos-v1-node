const {printInventory, getSpecialItems, getProperty, getAmount, calTotalAmount, calDiscount, calFinalCost} = require('../main/main');

describe('pos', function () {

    beforeEach(function () {
        inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
    });

    it('get BUY_TWO_GET_ONE_FREE items', function () {
        let result = getSpecialItems();
        expect(result).toEqual(['ITEM000000', 'ITEM000001', 'ITEM000005']);

    });

    it('get a certain property if barcode is provided', function () {
        let result = getProperty('ITEM000001', 'name');
        expect(result).toEqual('雪碧');

    });

    it('get item amount from a single input', function () {
        let result1 = getAmount('ITEM000001');
        let result2 = getAmount('ITEM000003-2');
        expect(result1).toEqual(['ITEM000001', 1]);
        expect(result2).toEqual(['ITEM000003', 2]);
    });

    it('get total amount of all stuff', function () {
        let inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
        let result = calTotalAmount(inputs);
        expect(result).toEqual({'ITEM000001': 5, 'ITEM000003': 2, 'ITEM000005': 3});

    });

    it('get discount from inputs', function () {
        let inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
        let totalAmount = calTotalAmount(inputs);
        let discount = calDiscount(totalAmount);
        expect(discount).toEqual({'ITEM000001': 1, 'ITEM000005': 1});

    });

    it('get all infos needed to be printed', function () {
        let totalAmount = {'ITEM000001': 5, 'ITEM000003': 2, 'ITEM000005': 3};
        let discount = {'ITEM000001': 1, 'ITEM000005': 1};
        let result = calFinalCost(totalAmount, discount);
        let expectResult = {
            items:
                {
                    ITEM000001:
                        {name: '雪碧', amount: 5, unit: '瓶', price: 3, totalCost: 12},
                    ITEM000003:
                        {name: '荔枝', amount: 2, unit: '斤', price: 15, totalCost: 30},
                    ITEM000005:
                        {name: '方便面', amount: 3, unit: '袋', price: 4.5, totalCost: 9}
                },
            discountItems:
                {
                    ITEM000001: {name: '雪碧', disAmount: 1, unit: '瓶'},
                    ITEM000005: {name: '方便面', disAmount: 1, unit: '袋'}
                },
            needToPay: 51,
            discountValue: 7.5
        };
        expect(result).toEqual(expectResult);

    });


    it('should print correct text', function () {

        spyOn(console, 'log');

        printInventory(inputs);

        var expectText =
            '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});
