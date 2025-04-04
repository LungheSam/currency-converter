import React, { useState, useEffect } from 'react';
import currencyToCountry from './currencyToCountry';
import './App.css';

function App() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  const apiKey = '9d099089aa1c494d8c4d85b372d0fbc7'; 
  const baseURL = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

  useEffect(() => {
    fetch(baseURL)
      .then((response) => response.json())
      .then((data) => {
        setExchangeRates(data.rates);
        setCurrencies(Object.keys(data.rates));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching exchange rates:', error);
        setLoading(false);
      });
  }, []);

  const handleConvert = () => {
    if (!amount || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return;

    const result =
      (amount / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];

    setConvertedAmount(result.toFixed(5));
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    handleConvert();
  };

  return (
    <div className="currency-exchange-container">
      <h1 className="title">Currency Exchange</h1>
      {loading ? (
        <div>Loading exchange rates...</div>
      ) : (
        <div className="exchange-form">
          <div className="input-group">
            <h3 className="input-group-title">Amount</h3>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
        
          <div className="currency-selectors">
            {/* From Currency */}
            <div className="currency-group">
              <label htmlFor="fromCurrency">From</label>
              <div className="currency-select-wrapper">
                <img
                  src={`https://flagcdn.com/w40/${currencyToCountry[fromCurrency]?.toLowerCase()}.png`}
                  alt={fromCurrency}
                  className="currency-flag"
                />
                <select
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="swap-btn" onClick={handleSwap}>
              ↔️
            </button>

            {/* To Currency */}
            <div className="currency-group">
              <label htmlFor="toCurrency">To</label>
              <div className="currency-select-wrapper">
                <img
                  src={`https://flagcdn.com/${currencyToCountry[toCurrency]?.toLowerCase()}.svg`}
                  alt={toCurrency}
                  width="40"
                  className="currency-flag"
                />
                <select
                  id="toCurrency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button className="convert-btn" onClick={handleConvert}>
            Convert
          </button>

          {convertedAmount && (
            <div className="result">
              <h2>Converted Amount:</h2>
              <p>
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
