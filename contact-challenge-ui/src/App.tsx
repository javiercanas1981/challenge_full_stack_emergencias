

import { useState } from "react";
import { Provider } from "react-redux";
import "./App.css";
import AppRouter from "./components/AppRouter/AppRouter";
import store from "./redux/store/Store";

function App() {
  const [activeNav, setActiveNav] = useState<string>("contacts");

  return (
    <Provider store={store()}>
      <AppRouter setActiveNav={setActiveNav} />
    </Provider>
  );
}

export default App;
