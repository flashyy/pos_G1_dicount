"use strict";
let _ = require('lodash');
let {loadAllItems, loadPromotions} = require('../main/fixtures');
function printReceipt(tags) {
    let allItems = loadAllItems();
    let formattedTags = formatTags(tags);
    let countedbarcodes = countBarcodes(formattedTags);
    let cartItems = buildCartItems(countedbarcodes, allItems);
    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems, promotions);
    let totalprices = calculateTotalprices(promotedItems);

}

function formatTags(tags) {
    return _.map(tags, (tag) => {
        if (tag.includes('-')) {
            let [barcode,count] = tag.split('-');
            return {barcode, count: parseInt(count)}
        } else {
            return {barcode: tag, count: 1}
        }
    });
}
function getExistElementByBarcode(array, barcode) {
    return _.find(array, (element) => element.barcode === barcode);
}

function countBarcodes(formattedTags) {
    return _.reduce(formattedTags, (result, formattedTag) => {
        let found = getExistElementByBarcode(result, formattedTag.barcode);
        if (found) {
            found.count += formattedTag.count;
        }
        else {
            result.push(formattedTag)
        }
        return result;
    }, [])
}

function buildCartItems(countedBarcodes, allItems) {
    return _.map(countedBarcodes, ({count, barcode}) => {
        let {name, unit, price} = getExistElementByBarcode(allItems, barcode);
        return {name, unit, price, count, barcode};
    });
}

function buildPromotedItems(cartItems, promotions) {
    let currentpromotion = promotions.find((promotion) => promotion.type === 'BUY_THREE_GET_ONE_FREE');
    let one = _.map(cartItems, (cartItem) => {
        let hasPromoted = currentpromotion.barcodes.includes(cartItem.barcode) && cartItem.count >= 3;
        let totalPrice = cartItem.count * cartItem.price;
        let saved = hasPromoted ? totalPrice / 3 : 0;
        let payprice = totalPrice - saved;
        return Object.assign({}, cartItem, {payprice, saved: _fixPrice(saved)});
    });

    let nextpromotion = promotions.find((promotion) => promotion.type === 'OTHER_PROMOTION');
    return _.map(one, (element) => {
        let hasPromoted = nextpromotion.barcodes.includes(element.barcode);
        console.log(hasPromoted);
        element.saved = hasPromoted ? element.count * element.price * 0.1 : element.saved;
        element.payprice = hasPromoted ? element.price * element.count - element.saved : element.payprice;
        return element;
    });
}


function _fixPrice(number) {
    return parseFloat(number.toFixed(2));
}

function calculateTotalprices(promotedItems) {
    return _.reduce(promotedItems, (result, promotedItem) => {
        result.totalpayprice += promotedItem.payprice;
        result.totalsaved += promotedItem.saved;
        return result;
    }, {totalpayprice: 0, totalsaved: 0});
}


module.exports = {
    formatTags: formatTags,
    countBarcodes: countBarcodes,
    buildCartItems: buildCartItems,
    buildPromotedItems: buildPromotedItems,
    calculateTotalprices: calculateTotalprices,
};
