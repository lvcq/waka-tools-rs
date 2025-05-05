import "./App.css";
import { Outlet, useLocation, Navigate } from "react-router";
import { RouterPath } from "./models/RouterModel";
import { GlobalToaster } from "@components/GlobalToaster";
import { makeStyles } from "@fluentui/react-components";
import { AppBar } from "@components/AppBar";

const useStyles = makeStyles({
  appContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  appMain: {
    flex: 1,
    overflow: 'hidden'
  }
})

function App() {

  const location = useLocation()
  const styles = useStyles()

  return (
    <div className={styles.appContainer}>
      <AppBar />
      <div className={styles.appMain}>
        {location.pathname === "/" ? <Navigate to={RouterPath.DASHBOARD} /> : null}
        <Outlet />
        <GlobalToaster />
      </div>
    </div>
  )

}

export default App;
