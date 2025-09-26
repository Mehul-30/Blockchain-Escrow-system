import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Welcome from "./components/Welcome"
import Services from "./components/Services"
import Transactions from "./components/Transactions"

const  App=()=>{
  return (
    <>
      <Navbar />
      <Welcome />
      <Services />
      <Transactions />
      <Footer />
    </>
  )
}

export default App
