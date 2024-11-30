// static data
import { orderHistoryData } from '@/data/static/trading-data';

import cn from '@/utils/cn';
import SimpleBar from '@/components/ui/simplebar';
import Text from '@/components/ui/text';

type HistoryCellPropsType = {
  title: string;
  text: string;
  className?: string;
};

function OrderHistoryCell({ title, text, className }: HistoryCellPropsType) {
  return (
    <div className={cn('text-center', className)}>
      <Text
        tag="h6"
        className="text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {title}
      </Text>
      <Text
        tag="span"
        className="text-sm uppercase text-gray-500 dark:text-gray-500"
      >
        {text}
      </Text>
    </div>
  );
}

export default function OrderHistory() {
  return (
    <>
      <div className="grid grid-cols-3 pb-5 sm:grid-cols-4">
        <Text
          tag="h6"
          className="text-start text-sm text-gray-500 dark:text-gray-300"
        >
          Execution Time
        </Text>
        <Text
          tag="h6"
          className="text-center text-sm text-gray-500 dark:text-gray-300"
        >
          Avg. Price
        </Text>
        <Text
          tag="h6"
          className="hidden text-center text-sm text-gray-500 dark:text-gray-300 sm:block"
        >
          Executed Quantity
        </Text>
        <Text
          tag="h6"
          className="text-end text-sm text-gray-500 dark:text-gray-300"
        >
          Executed Amount
        </Text>
      </div>
      <SimpleBar style={{ maxHeight: 420 }} className="-mx-4 px-4">
        <div className="space-y-5">
          {orderHistoryData.map((item) => (
            <div
              className="grid grid-cols-3 gap-5 sm:grid-cols-4"
              key={item.id}
            >
              <OrderHistoryCell
                className="text-start"
                title={item.title}
                text={item.createdDate}
              />
              <OrderHistoryCell title={item.avgPrice} text={item.unit} />
              <OrderHistoryCell
                title={item.executedQuantity}
                text={item.unit}
                className="hidden sm:block"
              />
              <OrderHistoryCell
                className="text-end"
                title={item.executedAmount}
                text={item.unit}
              />
            </div>
          ))}
        </div>
      </SimpleBar>
    </>
  );
}
