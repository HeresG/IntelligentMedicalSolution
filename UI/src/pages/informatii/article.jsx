import { Box, Grid2, Typography } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import api from '../../services/axiosConfig'
import { useMatches } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setInitialCategories } from '../../store/info/action'
import { getCategoryInfoByNameSelector } from '../../store/info/selectors'
import { TextParser } from '../../components/TextParser/TextParser'

export const Article = () => {
    const dispatch = useDispatch();
    const match = useMatches(['/informatii/categorii-boli']);

    const articleName = useMemo(() => {
        const lastPath = match[match.length - 1]
        return (lastPath.params.articleName)
    }, [match])

    const encodedArticleName = encodeURI(articleName)

    const article = useSelector(getCategoryInfoByNameSelector(articleName))


    useEffect(() => {
        api(`/article/${encodedArticleName}`).then(res => {
            const { data, message } = res.data

            dispatch(setInitialCategories([data]))
        })
            .catch(error => {
                console.error(error.message);
            })
    }, [])

    if (!article) return;

    return (
        <>
            <Box sx={{ width: 1, backgroundColor: theme => `${theme.palette.primary.main}20`, padding: '2em 0', mb: 4 }}>
                <PageContainer>
                    <Grid2 container alignItems="center" spacing={2}>
                        <Grid2 size="grow">
                            <PageHeader pageName={article?.name} />
                        </Grid2>
                    </Grid2>

                </PageContainer>
            </Box>
            <PageContainer>
                <Grid2 container spacing={2}>
                    <Grid2>

                        <Typography variant="h6">{article?.description}</Typography>
                    </Grid2>
                    {article?.content && <Grid2>
                        <TextParser text={article?.content} />
                    </Grid2>}
                </Grid2>
            </PageContainer>
        </>
    )
}
