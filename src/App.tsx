import Router from "./router/Router";
import Layout from "./layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { ProjectThemeProvider } from "./providers/ProjectThemeProvider";
import { SnackProvider } from "./providers/SnackProvider";
import { UserProvider } from "./providers/UserProvider";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <ProjectThemeProvider>
            <SnackProvider>
              <Layout>
                <Router />
              </Layout>
            </SnackProvider>
          </ProjectThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
