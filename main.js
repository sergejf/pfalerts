var _ = require('lodash');
// var finance = require('yahoo-finance');
var finance = require('google-finance');
const WilliamsR = require('technicalindicators').WilliamsR;

const WRTHRESHOLD = -60.0;
const WRPERIOD = 14;
const TODAY = '2017-02-26';

var SYMBOLS = [
    'BDCL',
    'CEFL',
    'AMU',
    'BNDX',
    'DGS',
    'SDOG',
    'FYT',
    'FV',
    'DFE',
    'MORL',
    'RWX',
    'VNQI',
    'LON:EUDV',
    'LON:SEML',
    'LON:IEDY',
    'LON:IUAG',
    'AMS:IAPD'
];

var today = new Date(TODAY);
var startdate = new Date(today - 1000 * 60 * 60 * 24 * WRPERIOD * 2);

var dates = new Array;
var high = new Array;
var low = new Array;
var close = new Array;
var williamsr = new Array;
var notifications = [];

finance.historical({
    symbols: SYMBOLS,
    from: startdate,
    to: TODAY,
    // period: 'd' // for Yahoo Finance only
}, function (err, result) {
    if (err) { throw err; }
    _.each(result, function (quotes, symbol) {
        dates = [];
        high = [];
        low = [];
        close = [];
        _.each(quotes, function (quote) {
            if (quote) {
                dates.push(quote.date);
                high.push(quote.high);
                low.push(quote.low);
                close.push(quote.close);
            } else {
                console.log('N/A');
            }
        });
        let period = WRPERIOD;
        let input = {
            high: high,
            low: low,
            close: close,
            period: period,
        };
        williamsr = WilliamsR.calculate(input);
        _.each(williamsr, function (value, i) {
            if (value < WRTHRESHOLD) {
                wrdate = new Date(dates[i + WRPERIOD - 1])
                if (wrdate >= today) {
                    notifications.push([wrdate, symbol, value]);
                }
            }
        });
    });
    if (notifications.length > 0) {
        _.each(notifications, function (alert) {
            console.log(alert);
        });
    } else {
        console.log("no alert");
    }
});


