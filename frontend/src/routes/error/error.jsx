import './error.css';

import {useRouteError} from "react-router-dom";
import {Text, Spacer} from "@nextui-org/react";


export default function Error() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="something-went-wrong">
      <div>
        <Text h1 css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
          textAlign: "center"
        }}
              weight="bold">Something Went Wrong!</Text>
        <Spacer y={3}/>
        <Text
          color="error"
        >{error.statusText || error.message}</Text>
      </div>

    </div>
  )
}
