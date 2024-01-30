# Unit Testing
We will be using jest to create our test cases. We will be creating test on a component level. That means typically for <Component>.jsx there should a <Component>Test.jsx file in  __ tests __ directory as well.

## CollabHome.jsx

Test file is called `CollabHomeTest.jsx`

1. Test whether the basic UI components are present.
2. Changing value in the text fields should have an effect on the respective text fields.
3. When  submit is clicked, the component should make an effort to go to the room editor

## App.jsx

Test file is called `AppTest.jsx`

1. Check is some essential components are present when app.jsx is rendered
2. Check if auth is attempted with username is found
3. User should be redirected if there are no username present in cookies.
