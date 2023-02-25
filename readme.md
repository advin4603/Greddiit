# DASS Assignment 1

- Ayan Datta

## Running the Web Server

Make sure you have the latest version of docker compose installed

Run the following command to run the server

```shell
docker compose up
```

You can now access the website at [http://localhost:8000]()

## Implementation Details

### Subgreddiits page renamed to Explore page

- The subgreddiits page was renamed to the explore page to help disambiguate it from the my subgreddiits page

### Creating a new subgreddiit doesn't ask for all details

- When creating a new subgreddiit from My Subgreddiits, the profile picture and the list of banned keywords and tags is
  not asked for.
- The user is supposed to later add those in via the settings tab of the subgreddiits page.
- This was done to help users easily create subgreddiits with only the minimal required info.

### Posts in the subgreddiit page

- Along with the tabs for viewing users, join requests, etc. I have added a posts tab which shows the posts.
- In the subgreddiit page, a follower can view only this posts tab and the users tab.

### Multiple sorting with names

- Since the names are not allowed to be identical, any further sorting methods are disabled when a sort based on name is
  selected

### Moderator in Users tab

- The moderator of a subgreddiit is shown with a green outline on their profile pic unlike other users.

### Separated Joined and Not Joined Subgreddiits

- All the subgreddiits have been partitioned into joined and not joined and showed in two separate collapsable menus

### Popover and block icon over already left or blocked from subgreddiits

- When attempting to join a subgreddiit from the explore page which the user has left or was blocked from, the logo is
  changed to hat of a block and a popover with the appropriate reason is displayed.


### Blocked Reports get deleted
- Reports upon which he block action was taken get deleted after the report expiry