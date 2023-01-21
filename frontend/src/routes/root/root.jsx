import {Navbar, Text, Button} from "@nextui-org/react";

export default function Root() {
  return (
    <div>
      <Navbar isBordered maxWidth="fluid">
        <Navbar.Brand><Text b>Greddiit</Text></Navbar.Brand>
        <Navbar.Content>
          <Navbar.Item>
            <Button shadow color="gradient" auto>
              Signout
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </div>
  );
}