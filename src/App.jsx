import RouteLayout from "./routes/Routes";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { ContentContext } from "./context/context";
import Loader from "./components/Loader/Loader";

function App() {
  const { isLoading } = ContentContext();

  return (
    <div className="App">
      <ScrollToTop />
      {isLoading ? <Loader /> : <RouteLayout />}
    </div>
  );
}

export default App;
