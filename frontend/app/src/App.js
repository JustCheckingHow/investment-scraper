import logo from './logo.svg';
import "bootstrap-css-only/css/bootstrap.min.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './App.css';
import Base from "./components/base";
import Search from './components/search';

function App() {
  return (
    <Base>
      <Search/>
    </Base>
  );
}

export default App;
