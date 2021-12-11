import logo from './logo.svg';
import "bootstrap-css-only/css/bootstrap.min.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './App.css';
import Base from "./components/base";
import Search from './components/search';
import InputForm from "./components/inputForm";
import { Route, Routes, BrowserRouter, Redirect } from "react-router-dom";

function App() {
  return (
    <Base>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/form" element={<InputForm />} />
          <Route path="*" element={<Redirect to="/" />} />
        </Routes>
      </BrowserRouter>
    </Base>
  );
}

export default App;
