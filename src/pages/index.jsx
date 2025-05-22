import Layout from './Layout.jsx'

import Calendar from './Calendar'

import Participants from './Participants'

import AppointmentForm from './AppointmentForm'

import Login from './Login.jsx'

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

const PAGES = {
  Calendar: Calendar,

  Participants: Participants,

  AppointmentForm: AppointmentForm,
}

function _getCurrentPage(url) {
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  let urlLastPart = url.split('/').pop()
  if (urlLastPart.includes('?')) {
    urlLastPart = urlLastPart.split('?')[0]
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  )
  return pageName || Object.keys(PAGES)[0]
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation()
  const currentPage = _getCurrentPage(location.pathname)

  return (
    <Layout currentPageName={currentPage}>
      <Routes>

        <Route path='/' element={<Calendar />} />

        <Route path='/Calendar' element={<Calendar />} />

        <Route path='/Participants' element={<Participants />} />

        <Route path='/AppointmentForm' element={<AppointmentForm />} />
      </Routes>
    </Layout>
  )
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  )
}
