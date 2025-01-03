type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}

// Constants
const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

// Utility functions
const getPriority = (blockchain: Blockchain): number =>
  BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;

const formatBalance = (balance: WalletBalance): FormattedWalletBalance => ({
  ...balance,
  formatted: balance.amount.toFixed()
});

// Component
interface WalletPageProps extends BoxProps {}

const WalletPage: React.FC<WalletPageProps> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedAndFormattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) =>
        getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      })
      .map(formatBalance);
  }, [balances]);

  const renderWalletRow = (balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;

    return (
      <WalletRow
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  };

  return (
    <div {...rest}>
      {sortedAndFormattedBalances.map(renderWalletRow)}
    </div>
  );
};

export default WalletPage;
