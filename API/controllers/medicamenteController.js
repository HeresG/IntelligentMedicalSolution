import prisma from "../config/databaseInstance.js";

export const getMedicamente = async (req, res) => {
    const { name } = req.body;
  
    try {
      const medicamente = await prisma.medicamente.findMany({
        where: { name },
      });
  
      res.status(200).json({
        data: medicamente,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Eroare interna' });
    }
  };
  