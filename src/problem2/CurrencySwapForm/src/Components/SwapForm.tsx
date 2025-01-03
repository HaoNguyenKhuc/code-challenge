import { useState, useEffect } from "react";
import {
  Card,
  Select,
  Input,
  Typography,
  Space,
  Spin,
  Image,
  Flex,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

type ValidKeys = "STEVMOS" | "RATOM" | "STOSMO" | "STATOM" | "STLUNA";

const mapIncorrectObj: Record<ValidKeys, string> = {
  STEVMOS: "stEVMos",
  RATOM: "rATOM",
  STOSMO: "stOSMO",
  STATOM: "stATOM",
  STLUNA: "stLUNA",
};

type CurrenciesModel = {
 currency: string;
 date?: string;
 price?: number;
 iconUrl?: string;
};

const CurrencySwap = () => {
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [currencies, setCurrencies] = useState<CurrenciesModel[]>([]);
  const [formData, setFormData] = useState({
    fromCurrency: undefined,
    toCurrency: undefined,
    fromAmount: "",
    toAmount: "",
  });

  const removeDuplicates = (data: CurrenciesModel[]) => {
    const uniqueMap = new Map();

    // Keep only the first occurrence of each currency-date combination
    data.forEach((item) => {
      const key = `${item.currency}-${item.date}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    // Convert map values back to array
    return Array.from(uniqueMap.values());
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Process mock price data
        const priceMap: Record<string, number> = {};
        const availableCurrencies: Array<CurrenciesModel> = [];
        const newMockData = removeDuplicates(data);
        newMockData.forEach((item) => {
          if (item.price) {
            priceMap[item.currency] = parseFloat(item.price);
            let iconName = item.currency;

            if (Object.keys(mapIncorrectObj).includes(item.currency)) {
              iconName = (mapIncorrectObj as any)[item.currency];
            }
            availableCurrencies.push({
              currency: item.currency,
              iconUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${iconName}.svg`,
            });
          }
        });

        setPrices(priceMap);
        setCurrencies(availableCurrencies);
        setLoading(false);
      } catch (err) {
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handleInputChange = (field: string, value: string | undefined) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (
      field === "fromAmount" ||
      field === "fromCurrency" ||
      field === "toCurrency"
    ) {
      const { fromCurrency, toCurrency, fromAmount } = newFormData;

      if (fromCurrency && toCurrency) {
       const fromRate = prices[fromCurrency] || 0;
       const toRate = prices[toCurrency];

       const amountInUSD = parseFloat(fromAmount) * fromRate;
       const result = (amountInUSD / toRate).toFixed(6);

        if (fromRate && toRate && fromAmount) {
          setFormData((prev) => ({
            ...prev,
            toAmount: result,
          }));
        }
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <Card style={{ width: "480px", maxWidth: "480px", margin: "0 auto" }}>
      <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>
        Swap Currencies
      </Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <div style={{ marginBottom: "8px" }}>Amount to send</div>
          <Select
            style={{ width: "100%", marginBottom: "12px" }}
            value={formData.fromCurrency}
            onChange={(value) => handleInputChange("fromCurrency", value)}
            placeholder="Select currency"
          >
            {currencies.map((item, index) => (
              <Option
                key={"from" + item.currency + index}
                value={item.currency}
              >
                <Flex justify="center" align="center" gap={2}>
                  {item.currency}
                  <Image
                    preview={false}
                    style={{ marginLeft: 8, textAlign: "center" }}
                    width={16}
                    src={item.iconUrl}
                  />
                </Flex>
              </Option>
            ))}
          </Select>

          <Input
            type="number"
            placeholder="0.00"
            value={formData.fromAmount}
            onChange={(e) => handleInputChange("fromAmount", e.target.value)}
            min="0"
            step="0.000001"
          />
        </div>

        <div>
          <div style={{ marginBottom: "8px" }}>Amount to receive</div>
          <Select
            style={{ width: "100%", marginBottom: "12px" }}
            value={formData.toCurrency}
            onChange={(value) => handleInputChange("toCurrency", value)}
            placeholder="Select currency"
          >
            {currencies.map((item, index) => (
              <Option key={"to" + item.currency + index} value={item.currency}>
                <Flex justify="center" align="center" gap={2}>
                  {item.currency}
                  <Image
                    preview={false}
                    style={{ margin: 8, textAlign: "center" }}
                    width={16}
                    src={item.iconUrl}
                  />
                </Flex>
              </Option>
            ))}
          </Select>

          <Input
            placeholder="0.00"
            value={formData.toAmount}
            disabled
            style={{ backgroundColor: "#f5f5f5" }}
          />
        </div>

      </Space>
    </Card>
  );
};

export default CurrencySwap;
