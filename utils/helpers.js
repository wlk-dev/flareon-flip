const baseNumberFormat = Intl.NumberFormat('en', {style: 'decimal', maximumFractionDigits: 0});

module.exports = {
    uuid: () => { Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) },
    formatNum: (num) => {return baseNumberFormat.format(num)}
}