import {Text, Spacer} from "@nextui-org/react";
import '../error/error.css';

export default function NotFound() {

  return (
    <div id="something-went-wrong">
      <div>
        <Text h1 css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
          textAlign: "center"
        }}
              weight="bold">404, Couldn't Find page</Text>
      </div>

    </div>
  )
}
