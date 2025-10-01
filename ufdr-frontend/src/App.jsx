

import './App.css'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/Login'
import { Applayout } from './pages/Applayout'
import { UserContext, UserContextProvider } from './context/user.context'
import Uploady from './pages/upload'
import UFDRReportsPage from './pages/ufdrfiles'
import Userprotectroute from './components/userprotectroute'
import Ufdrchatbot from './pages/ufdrchatbot'
import UpcomingFeatures from './pages/upcoming'
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout/>,
      children:[
    
        {
          path: "/login",
          element: <Login/>
    },
    {
      path:"/register",
      element:<Register/>
    },
    {
      path:"/upload",
      element:<Userprotectroute><Uploady/></Userprotectroute>
    },{
      path:"/analysis",
      element:<Userprotectroute><UFDRReportsPage/></Userprotectroute>
    },{
      path:"/analysis2",
      element:<Userprotectroute><Ufdrchatbot/></Userprotectroute>

    },
    {
      path:'/upcoming',
      element:<UpcomingFeatures/>
    }
    

      ]
    }
  ])
  

  return (
    <>
    <UserContextProvider>
      <RouterProvider router={router} >
        </RouterProvider>
        </UserContextProvider>
    </>
  )
}

export default App
