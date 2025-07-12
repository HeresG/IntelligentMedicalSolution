import prisma from "../config/databaseInstance.js";
import { getS3FileStream } from "../services/blobService.js";

export const getAllNameAndDescription = async (_, res) => {
    try {
        const articles = await prisma.article.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                imageId: true,
            },
        });

        res.json({
            message: 'Articolele au fost agregate cu succes',
            data: articles,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Eroare internă' });
    }
};

export const getByName = async (req, res) => {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    try {
        const data = await prisma.article.findFirst({
            where: { name: decodedName },
        });

        if (!data) {
            return res.status(404).json({ error: 'Articolul nu a fost găsit' });
        }

        res.json({
            message: 'Articolul a fost agregat cu succes',
            data,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Eroare internă' });
    }
};


