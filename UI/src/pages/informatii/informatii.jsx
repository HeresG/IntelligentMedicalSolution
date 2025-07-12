import React, { useEffect } from 'react'
import { Outlet, useMatch, useMatches, useNavigate, useResolvedPath } from 'react-router-dom'
import { protectedRoutes } from '../../services/router';

export const Informatii = () => {
  const match = useMatches(['/informatii']); 
  const navigate = useNavigate();
  
  useEffect(() => {
    if(match.length === 1){      
      const currentPathInRoute = protectedRoutes.find(route => route.path === match[0].pathname)      
      currentPathInRoute && navigate(currentPathInRoute.children[0].path)
    }
  }, [match])
  return <Outlet />
}
