"use strict";
let {
    formatTags,
    countBarcodes,
    buildCartItems,
    buildPromotedItems,
    calculateTotalprices,
    buildReceipt
} = require('../main/main');

let {loadAllItems, loadPromotions} = require('../main/fixtures');


describe('pos discount', () => {
    it('format the String', () => {
        let tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2'
        ];
        let formattedTags = formatTags(tags);
        const expected = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2}
        ];
        expect(formattedTags).toEqual(expected);
    });

    it('count the barcode', () => {
        let formattedTags = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2}
        ];
        let countedBarcodes = countBarcodes(formattedTags);

        const expected = [
            {barcode: 'ITEM000001', count: 3},
            {barcode: 'ITEM000003', count: 2}
        ];
        expect(countedBarcodes).toEqual(expected);
    });

    it('load allItems', () => {
        let countedBarcodes = [
            {barcode: 'ITEM000001', count: 3},
            {barcode: 'ITEM000003', count: 2}
        ];
        let allItems = loadAllItems();
        let cartItems = buildCartItems(countedBarcodes, allItems);

        const expected = [
            {
                barcode: 'ITEM000001',
                name: '羽毛球',
                unit: '个',
                price: 1.00,
                count: 3,
                type: ''
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                type: ''

            }
        ];
        expect(cartItems).toEqual(expected);
    });

    it('load allpromotion', () => {
        let cartItems = [
            {
                barcode: 'ITEM000001',
                name: '羽毛球',
                unit: '个',
                price: 1.00,
                count: 3,
                type: ''
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                type: ''
            }
        ];
        let promotions = loadPromotions();
        let promotedItems = buildPromotedItems(cartItems, promotions);

        const expected = [
            {
                barcode: 'ITEM000001',
                name: '羽毛球',
                unit: '个',
                price: 1.00,
                count: 3,
                payprice: 2.00,
                saved: 1.00,
                type: '买三赠一'
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payprice: 27.00,
                saved: 3.00,
                type: '九折'
            }
        ];
        expect(promotedItems).toEqual(expected);
    });

    it('count all price', () => {
        const promotedItems = [
            {
                barcode: 'ITEM000001',
                name: '羽毛球',
                unit: '个',
                price: 1.00,
                count: 3,
                payprice: 2.00,
                saved: 1.00,
                type: '买三赠一'

            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payprice: 27.00,
                saved: 3.00,
                type: '九折'
            }
        ];
        let totalprices = calculateTotalprices(promotedItems);

        const expected = {
            totalpayprice: 29.00,
            totalsaved: 4.00
        };

        expect(totalprices).toEqual(expected);
    });

    it('build receipt', () => {
        const promotedItems = [
            {
                barcode: 'ITEM000001',
                name: '羽毛球',
                unit: '个',
                price: 1.00,
                count: 3,
                payprice: 2.00,
                saved: 1.00,
                type: '买三赠一'

            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payprice: 27.00,
                saved: 3.00,
                type: '九折'
            }
        ];
        const totalprices = {
            totalpayprice: 29.00,
            totalsaved: 4.0
        };

        let receipt = buildReceipt(promotedItems, totalprices);

        const expected = {
            receiptItems: [
                {
                    // barcode: 'ITEM000001',
                    name: '羽毛球',
                    unit: '个',
                    price: 1.00,
                    count: 3,
                    payprice: 2.00,
                    saved: 1.00,
                    // type: '买三赠一'

                },
                {
                    // barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    count: 2,
                    payprice: 27.00,
                    saved: 3.00,
                    // type: '九折'
                }
            ],
            savedItems: [{name: '羽毛球',type:'买三赠一'}, {name: '荔枝',type:'九折'}],
            totalpayprice: 29.00,
            totalsaved: 4.0
        };

        expect(receipt).toEqual(expected);
    });
});
