import { Outlet, useLocation } from 'react-router'
import Header from '../components/Header.jsx'
import CategoryNav from '../components/CategoryNav.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import Footer from '../components/Footer.jsx'
import MobileTabBar from '../components/MobileTabBar.jsx'
import { readSettings } from '../services/settingsService.js'

function PublicLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <CategoryNav />

      {/* Na página inicial, o banner ocupa a largura toda da tela */}
      {isHome && <HeroBanner src={readSettings().banner} />}

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