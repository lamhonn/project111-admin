import { CreateOrganizationButton } from './components/CreateOrganizationButton'
import { graphqlClient } from './utils/graphqlClient'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
 
  async function handleCreateOrganization() {
    const today = new Date();
    //alert('Create new organization')
    const testOrganization = {
      email: "testorganization1@gmail.com",
      expiresAt: new Date(today.getTime() + 86400000).toISOString() //TODO: this day + 24hrs
      // create an setting config for this
    }

    const query = `
      mutation CreateOrganizationCreationToken($input: CreateOrganizationCreationTokenInput!) {
        createOrganizationCreationToken(input: $input) {
          code
          success
          message
          organizationCreationToken {
            email,
            expiresAt
          }
        }
      }
    `;

    try {
      const newOrganizationCreationToken = await graphqlClient.query(query, { input: testOrganization });
      console.log("Created organization creation token: ", newOrganizationCreationToken);
    } catch (error) {
      console.error("Error creating organization creation token:", error);
    }
    // TODO: Implement organization creation logic
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <CreateOrganizationButton onClick={handleCreateOrganization} />
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
