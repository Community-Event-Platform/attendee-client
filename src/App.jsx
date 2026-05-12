import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Header />
      <Login />

      <div className="container py-5">
        <h1>Homepage</h1>
      </div>

      <Footer />
    </>
  );
}

export default App;