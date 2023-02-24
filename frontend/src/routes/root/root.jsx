import {Navbar, Text, Button, Dropdown, Avatar, Grid} from "@nextui-org/react";
import {Outlet, useNavigation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {JWTContext} from "../../contexts/jwtContext.js";
import {useContext} from "react";
import SignOutIcon from "../../icons/signOutIcon.jsx";
import UserIcon from "../../icons/userIcon.jsx";
import MySubgreddiitsIcon from "../../icons/mySubgreddiitsIcon.jsx";
import ExploreIcon from "../../icons/exploreIcon.jsx";
import SavedPostsIcon from "../../icons/savedPostsIcon.jsx";
import "./root.css"
import backend from "../../backend/backend.js";
import greddiitLogo from "../../assets/greddiit.svg"

export default function Root() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const {jwt, setJWT, username} = useContext(JWTContext);
  return (
    <>
      <Navbar isBordered maxWidth="fluid" variant="floating">
        <Navbar.Brand>
          <Grid.Container gap={1} alignItems="center">
            <Grid>
              <img height="50rem" src={greddiitLogo} alt="Greddiit Logo"/>
            </Grid>
            <Grid>
              <Text style={{marginBottom: "0"}} h3>Greddiit</Text>
            </Grid>
          </Grid.Container>

        </Navbar.Brand>
        <Navbar.Content>
          <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  color="gradient"
                  as="button"
                  src={`${backend.defaults.baseURL}users/${username}/profilePic`}
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              disabledKeys={["profile"]}
              onAction={(key) => {
                switch (key) {
                  case "signout":
                    setJWT(null)
                    break;
                  case "my-profile":
                    navigate(`u/${username}`)
                    break;
                  case "my-subgreddiits":
                    navigate("mysubgreddiits")
                    break;
                  case "explore":
                    navigate("explore")
                    break;
                  case "saved-posts":
                    navigate("savedposts")
                    break;
                  default:
                    break;
                }
              }
              }
            >
              <Dropdown.Item aria-label="Signed In as" key="profile" css={{height: "$18"}}>
                <Text b color="inherit" css={{d: "flex"}}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{d: "flex"}}>
                  u/{username}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item icon={<UserIcon/>} aria-label="View Profile" key="my-profile">
                My Profile
              </Dropdown.Item>
              <Dropdown.Item icon={<ExploreIcon/>} aria-label="Explore new Subgreddiits" key="explore">
                Explore
              </Dropdown.Item>
              <Dropdown.Item icon={<MySubgreddiitsIcon/>} aria-label="View My Subgreddiits" key="my-subgreddiits">
                My Subgreddiits
              </Dropdown.Item>
              <Dropdown.Item icon={<SavedPostsIcon/>} aria-label="View Saved Posts" key="saved-posts">
                Saved Posts
              </Dropdown.Item>
              <Dropdown.Item icon={<SignOutIcon/>} key="signout" aria-label="Sign Out" withDivider color="error">
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Content>
      </Navbar>
      <div id="outlet" className={navigation.state === "loading" ? "page-loading" : ""}>
        <Outlet/>
      </div>

      <div style={{height: 0.1}}></div>
    </>
  )
    ;
}