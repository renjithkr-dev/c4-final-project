// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 't70cga2gc5'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'mytech6.us.auth0.com',            // Auth0 domain
  clientId: 'RCln9qcvaiVdgtZm3lOCscyarFW9k4S9',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
