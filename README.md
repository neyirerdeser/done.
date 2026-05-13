# done.
A task manager, supporting multiple users

## Backend
- Framework: Node Express
- Tests: Jest
- Other Major Libraries:
  - bcryptjs
  - cors
  - dotenv
  - jsonwebtoken

## Frontend
- Framework: React + Vite
- Tests: Vitest
- Other Major Libraries:
  - Router
  - Axios
  - Redux
  - TailwindCSS
  - DaisyUI
  - Lucide-React
  - Hot Toast

## Database
- MongoDB: used with mongoose

## Future Improvements / Features
-	backend
    -	don’t respond with full object, send what needed from frontend
    -	split get endpoints to avoid page flickers (list title and content can be split)
-	frontend
    -	signup and register can be separate pages with more visual difference
-	rate limiting
- "today" list showing all tasks that are due today
- custom list icons

## Sources Used
- https://medium.com/@vihangamallawaarachchi.dev/unit-testing-your-node-js-express-typescript-backend-c25761bbedc9
- https://stackoverflow.com/questions/22278761/mongoose-difference-between-save-and-using-update
- https://www.mongodb.com/docs/manual/reference/operator/update/position/#:~:text=Definition,-$position&text=The%20$position%20modifier%20specifies%20the,appear%20with%20the%20$each%20modifier.&text=indicates%20the%20position%20in,the%20beginning%20of%20the%20array.
- https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
- https://stackoverflow.com/questions/70402305/jest-error-cannot-use-import-statement-outside-a-module-when-importing-node-fe
- https://jestjs.io/docs/expect#tomatchobjectobject
- https://tailwindcss.com/docs/
- https://v4.daisyui.com/docs/
- https://stackoverflow.com/questions/14262938/child-with-max-height-100-overflows-paren
- https://medium.com/@a.g.stranger/4-different-ways-you-can-wrap-react-components-38b02302b07d
- https://gist.github.com/nimone/c2a86eb3f8b0baae619e23635c741107
- https://redux.js.org/faq/code-structure
- https://stackoverflow.com/questions/57643808/what-is-the-difference-between-jest-fn-and-jest-spyon-methods-in-jest
- https://stackabuse.com/bytes/strip-non-numeric-characters-from-a-string-in-javascript/
- https://javascript.plainenglish.io/jest-mock-for-unit-testing-mern-backend-983c1e3fef83
- https://mswjs.io/docs/http/intercepting-requests/
- https://testing-library.com/docs/react-testing-library/
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/valueAsDate
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/validity
