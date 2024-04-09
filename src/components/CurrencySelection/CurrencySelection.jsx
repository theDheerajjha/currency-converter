import React, { useState, useEffect } from 'react';
import { Select, InputNumber } from 'antd';
import axios from 'axios';
import './CurrencySelection.css';

const { Option } = Select;

const CurrencySelection = () => {
    const [currencies, setCurrencies] = useState([]);
    const [fromCurrency, setFromCurrency] = useState('INR'); // Default 'From' currency is INR
    const [toCurrency, setToCurrency] = useState('INR'); // Default 'To' currency is INR
    const [amount, setAmount] = useState(1); // Default amount is 1
    const [exchangeRate, setExchangeRate] = useState(null);
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (fromCurrency && toCurrency) {
            fetchExchangeRate();
        }
    }, [fromCurrency, toCurrency]);

    useEffect(() => {
        calculateConvertedAmount();
    }, [amount, exchangeRate]);

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
            const currencyData = Object.keys(response.data.rates);
            setCurrencies(currencyData);
        } catch (error) {
            console.error('Error fetching currencies: ', error);
            setError('Failed to fetch currencies. Please try again later.');
        }
    };

    const fetchExchangeRate = async () => {
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            setExchangeRate(response.data.rates[toCurrency]);
        } catch (error) {
            console.error('Error fetching exchange rate: ', error);
            setError('Failed to fetch exchange rate. Please try again later.');
        }
    };

    const calculateConvertedAmount = () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setConvertedAmount('Invalid amount');
            return;
        }

        if (exchangeRate === null) {
            setConvertedAmount('Exchange rate not available. Please check selection.');
            return;
        }

        const result = amount * exchangeRate;
        setConvertedAmount(result);
    };

    const handleFromCurrencyChange = (value) => {
        setFromCurrency(value);
    };

    const handleToCurrencyChange = (value) => {
        setToCurrency(value);
    };

    const handleAmountChange = (value) => {
        setAmount(value);
    };

    return (
        <div className="currency-selection-container">
            <h1>Currency Converter</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="input-container">
                <label className="label">From:</label>
                <Select
                    showSearch
                    className="currency-select"
                    placeholder="Select Currency"
                    onChange={handleFromCurrencyChange}
                    value={fromCurrency}
                >
                    {currencies.map((currency) => (
                        <Option key={currency} value={currency}>
                            <img
                                src={`https://flagcdn.com/24x18/${currency.slice(0, 2).toLowerCase()}.png`}
                                alt={currency}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/24x18';
                                }}
                                style={{ marginRight: '5px' }}
                            />
                            {currency}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="input-container">
                <label className="label">To:</label>
                <Select
                    showSearch
                    className="currency-select"
                    placeholder="Select Currency"
                    onChange={handleToCurrencyChange}
                    value={toCurrency}
                >
                    {currencies.map((currency) => (
                        <Option key={currency} value={currency}>
                            <img
                                src={`https://flagcdn.com/24x18/${currency.slice(0, 2).toLowerCase()}.png`}
                                alt={currency}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/24x18';
                                }}
                                style={{ marginRight: '5px' }}
                            />
                            {currency}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="input-container">
                <label className="label">Amount:</label>
                <InputNumber
                    className="amount-input"
                    min={0.01}
                    defaultValue={1}
                    onChange={handleAmountChange}
                    value={amount}
                />
            </div>
            <div className="result-container">
                <div className="converted-amount">Converted Amount: <span className="converted-amount-value">{convertedAmount}</span></div>
            </div>
        </div>
    );
};

export default CurrencySelection;
