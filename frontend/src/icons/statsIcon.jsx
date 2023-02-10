import {ChartLine} from "phosphor-react";

export default function StatsIcon ({
                                        fill = 'currentColor',
                                        filled,
                                        size,
                                        height,
                                        width,
                                        label,
                                        ...props
                                      }) {
  return (
    <ChartLine
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};