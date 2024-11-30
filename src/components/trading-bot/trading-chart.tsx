'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';

export default function TradingChart(props: any) {
  const { isDarkMode } = useIsDarkMode();

  const [tooltipPosition, setTooltipPosition] = useState({
    display: 'none',
    left: 0,
    top: 0,
  });
  const { data, volumeData } = props;
  const chartContainerRef = useRef<any>();
  let container = chartContainerRef?.current;

  useEffect(() => {
    // const handleResize = () => {
    //   chart.resize(window.innerWidth, window.innerHeight);
    //   chart.applyOptions({
    //     width: container?.clientWidth,
    //     height: container?.clientHeight,
    //   });
    // };

    // currency formatter
    const currentLocale = window.navigator.languages[0];
    const myPriceFormatter = Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: 'USD',
    }).format;

    // create trading chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#4B5563',
      },
      grid: {
        vertLines: {
          color: 'transparent',
        },
        horzLines: {
          color: isDarkMode ? '#334155' : '#E2E8F0',
        },
      },
      localization: {
        priceFormatter: myPriceFormatter,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 2,
          color: '#10b981b5',
          style: LineStyle.Solid,
          labelBackgroundColor: '#10B981',
        },
        horzLine: {
          color: '#10B981',
          labelBackgroundColor: '#10B981',
        },
      },

      width: container?.clientWidth,
      height: container?.clientHeight,
      autoSize: true,
    });

    // Setting the border color for the vertical axis
    chart.priceScale('right').applyOptions({
      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    });

    // Setting the border color for the horizontal axis
    chart.timeScale().applyOptions({
      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    });

    // candle series styles
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10B981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10B981',
    });

    // volume series style
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    // chart price scale options
    chart.priceScale('').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // set chart data
    candleSeries.setData(data);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();

    // tooltip default value
    const toolTipWidth = 80;
    const toolTipHeight = 80;
    const toolTipMargin = 40;

    // update tooltip
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container?.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container?.clientHeight
      ) {
        setTooltipPosition({ display: 'none', left: 0, top: 0 });
      } else {
        const y = param.point.y;
        let left = param.point.x + toolTipMargin;
        if (left > container?.clientWidth - toolTipWidth) {
          left = param.point.x - toolTipMargin - toolTipWidth;
        }

        let top = y + toolTipMargin;
        if (top > container?.clientHeight - toolTipHeight) {
          top = y - toolTipHeight - toolTipMargin;
        }

        setTooltipPosition({ display: 'block', left: left, top: top });
      }
    });

    // window.addEventListener('resize', handleResize);

    return () => {
      // window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [
    data,
    volumeData,
    isDarkMode,
    container?.clientWidth,
    container?.clientHeight,
  ]);

  return (
    <div className="relative rounded-lg bg-white py-5 pe-0 pl-5 shadow-card dark:bg-light-dark 2xl:pl-8 3xl:h-full">
      <div
        ref={chartContainerRef}
        className="h-[350px] w-full sm:h-[450px] 2xl:h-[550px] 3xl:h-[570px]"
      />
      <div
        className="pointer-events-none absolute z-10 h-32 w-24 rounded-lg border border-gray-200 bg-white p-3 text-[#111827] shadow-main dark:border-gray-700 dark:bg-light-dark 3xl:w-28"
        style={{
          left: `${tooltipPosition.left}px`,
          top: `${tooltipPosition.top}px`,
          display: `${tooltipPosition.display}`,
        }}
      >
        <h3 className="text-sm font-medium text-[#111827] dark:text-gray-200">
          ETH/USDT
        </h3>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          25.521M
        </p>
        <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
          24H High
        </p>
        <p className="mt-1 text-xs font-normal text-[#10B981]">30,430.86</p>
      </div>
    </div>
  );
}
