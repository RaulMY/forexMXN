# forexMXN

ForexMXN is a simple web application that uses the Fixer.io API to obtain current and historical data of up to 169 different exchange rates.

## FIXER API USAGE

Given that it uses the free version of Fixer.io it only utilizes two endpoints, one to get the latest exchange rates with the Euro as its base currency, and one to get the exchange rates of a specific date, again with the Euro as its base currency. Changing the currency, or obtaining a time-series is not a feature of the free version.

## DATA MANIPULATION

The currencies are transformed to an MXN exchange rate by dividing the EURMXN rate with the respective EUR exchange rate.

  calculate(info) {
    Object.keys(info).forEach(key => {
      if (key !== 'MXN') {
        info[key] = (info['MXN'] / info[key]).toFixed(4);
      } else {
        info[key] = info[key].toFixed(4);
      }
     });
     console.log(info);
   return info;
  }
  
In order to obtain data for a time series, multiple calls are made to the API. In order to not use up all the available usage, depending on how big the time frame is, only up to 15 calls are made per request, divided evenly along the time series.

Each call obtains all 168 exchange rates, so no new calls are needed to view different currencies. Everytime a new currency is selected, the graph is given the corresponding values, without having to make a new call.

  getCurrencyValues(currency) {
    this.currentCurrency = currency;
    this.currencyValues = [];
    this.dataSource.data = [];
    this.dataSource.chart.caption = currency + 'MXN';
    this.graphValues.forEach((value, index) => {
      if (currency !== 'MXN') {
        this.currencyValues.push(value['MXN'] / value[currency]);
      } else {
        this.currencyValues.push(value[currency]);
      }
      this.dataSource.data.unshift({'label': this.dates[index], 'value': this.currencyValues[index].toFixed(5)});
    });
  }

## GRAPH

forexMXN uses the FusionCharts Angular component to draw the data obtained from the API.

