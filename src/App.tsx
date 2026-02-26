import RouteLayout from "./routes/Routes";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { ContentContext } from "./context/context";
import Loader from "./components/Loader/Loader";
import OfflineBanner from "./components/OfflineBanner/OfflineBanner";
import InstallPrompt from "./components/InstallPrompt/InstallPrompt";

function App() {
  const { isLoading } = ContentContext();

  return (
    <div className="App">
      <ScrollToTop />
      <OfflineBanner />
      <InstallPrompt />
      {isLoading ? <Loader /> : <RouteLayout />}
    </div>
  );
}

export default App;
