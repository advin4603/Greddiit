import {ClockClockwise} from "phosphor-react";

export default function AgeIcon ({
                                    fill = 'currentColor',
                                    filled,
                                    size,
                                    height,
                                    width,
                                    label,
                                    ...props
                                  }) {
  return (
    <ClockClockwise
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};