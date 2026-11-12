import { Outlet } from 'react-router'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import MobileTabBar from '../components/MobileTabBar.jsx'

function PublicLayout() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="site-main container" tabIndex={-1}>
        {/* O Outlet é onde a página da rota atual aparece */}
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
    </>
  )
}

export default PublicLayout