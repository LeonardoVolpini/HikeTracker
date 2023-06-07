# GUI TESTS

The GUI tests are performed by hand examining a series of key points. These points can be summarized as:

- Logical Consistency: The label of the element is significative of the action it performs and/or it is consistent with other elements of the page.
- Efficiency: The time the element takes to complete the action assigned to it is reasonable.
- Browser Compatibility: The broswer's functions (such as 'Back' or 'F5') do not interfere with the normal functioning of the element.
- Pagination: The placing of the element is properly lined with other elements in the page and does not leave too much blank space.

The tests will be performed on the files of the "components" folder and the "App.js" file, file by file. For a more agile reading, only non conforming elements will be reported.

## App.js

- Browser Compatibility: The page loads two times after a 'F5' refresh.
- Pagination: The page slightly resizes when a sliding bar appears on the side.

## Auth.js

### LoginButton

- Logical Consistency: The button is still displayed in the login form.

### LoginForm

- Logical Consistency: It is not clear that the 'Cancel' button will take you back to the main page.
- Pagination: The 'Don't you have an account? Get one now' button is not properly aligned with other elements in the page.

## hikePage.js

### GenericMap

- Efficiency: The time the map waits before refocusing is not based on the user's last interaction, but on their first, making the map exploration weird.

### HikePage

- Pagination: There is a weird amount of blank space between the hike card and the map.

## hikesCard.js

### HikeCard

- Pagination: The data within the cards is not displayed omogenously, with each card having a different disposition, height-wise.

### HikesContainer

- Pagination: The cards' placement is weird on some window sizes, leaving too much blank space.

## localGuide_view.js

- Logical Consistency: The errors in the forms are not consistent with each other.

- Pagination: RESOLVED

## Navigation.js

- Pagination: The element has different sizes depending on the name of the user and their role, as the text is wrapped vertically.

## newUserForm.js

- Logical Consistency: The selection dropdown for the role is implemented in a different way from the one used in the New Hike form. 
- Browser Compatibility: Refreshing the page before completing the sign up procedure causes the rest of the site not to work anymore, requiring a restart.

The page does not give enough feedback regarding errors or missing fields.

## SearchHut.js

### SearchHut

- Logical Consistency: The 'Reset Filters' button does not erase text in the fields as one would believe.

### HutCard

- Pagination: The placement of the data in the card depends on its length, making it not consistent between cards.