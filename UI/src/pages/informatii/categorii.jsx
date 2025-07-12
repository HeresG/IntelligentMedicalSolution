import { useCallback, useEffect } from 'react'
import api from '../../services/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setInitialCategories } from '../../store/info/action'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { Box, Button, Card, CardActions, CardContent, Grid2, Typography } from '@mui/material'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { getAllCategories } from '../../store/info/selectors'
import { AsyncImage } from '../../components/AsyncImage/AsyncImage'
import { Outlet, useMatches, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

const optionalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

export const Categorii = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const match = useMatches(['/informatii']);
  const onParentPage = match.length <= 2
  
  const categories = useSelector(getAllCategories)
  useEffect(() => {
    if (!onParentPage) return
    api("/article/boli").then(res => {
      const { data, message } = res.data
      dispatch(setInitialCategories(data))
    })
      .catch(error => {
        console.error(error.message);
      })
  }, [onParentPage])

  const handleNavigateToArticle = useCallback((pagePath) => {
    navigate(pagePath)
  }, [categories])

  if (!onParentPage) {
    return <Outlet />
  }

  return (
    <>
      <Box sx={{ width: 1, backgroundColor: theme => `${theme.palette.primary.main}20`, padding: '2em 0', mb: 4 }}>
        <PageContainer>
          <Grid2 container alignItems="center" spacing={2}>
            <Grid2 size="grow">
              <PageHeader pageName="Informatii despre boli" caption="Afla informatii despre boli" />
            </Grid2>
          </Grid2>

        </PageContainer>
      </Box>
      <PageContainer>
        <Grid2 container alignItems="center" spacing={2}>
          {(categories && !!Object.keys(categories).length) ? Object.entries(categories).map(([categories, data]) => {
            const UUID = uuidv4();
            return (
              <Grid2 size={4} key={UUID}>
                <Card sx={{ backgroundColor: theme => theme.palette.background.default }}>
                  <Box sx={{
                    display: 'block',
                    width: 1,
                    height: 320,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <AsyncImage style='stretch' imageId={data?.imageId} 
                    width="711" height="400"
                     optionalStyle={optionalStyle} />
                  </Box>
                  <CardContent><Typography gutterBottom variant="h5" component="div">
                    {data?.name}
                  </Typography>
                    <Typography variant="body2" sx={{
                      color: 'text.secondary',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {data?.description}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Button variant="text" onClick={() => handleNavigateToArticle(data?.name)}>Citeste mai mult</Button>
                  </CardActions>
                </Card>
              </Grid2>
            )
          }) :
            <Grid2>
              <Typography>Nu exista informatii despre boli momentan</Typography>
            </Grid2>
          }

        </Grid2>
      </PageContainer>
    </>
  )
}
