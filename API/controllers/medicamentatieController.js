import prisma from "../config/databaseInstance.js";

export const createMedicamentatie = async (req, res) => {
  const { name, startDate, endDate, medicines } = req.body;
  const { userId } = req.user;

  try {
    const existing = await prisma.medicamentatie.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "Deja exista un jurnal de medicamentatie cu acest nume",
      });
    }

    const medicamentatie = await prisma.medicamentatie.create({
      data: {
        name: name || new Date(startDate).toDateString(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
    });

    for (const medicine of medicines) {
      const medicament = await prisma.medicamente.findUnique({
        where: { name: medicine.name },
      });

      if (!medicament) {
        return res.status(404).json({
          error: `Medicamentul '${medicine.name}' nu a fost gasit.`,
        });
      }

      await prisma.medicamentatie_Medicamente.create({
        data: {
          medicamentatieId: medicamentatie.id,
          medicamentId: medicament.id,
          quantity: medicine.quantity,
        },
      });
    }

    const linked = await prisma.medicamentatie_Medicamente.findMany({
      where: { medicamentatieId: medicamentatie.id },
      include: {
        medicament: true,
      },
    });

    const medicamentatieWithRelations = await prisma.medicamentatie.findUnique({
      where: { id: medicamentatie.id },
      include: {
        medicamenteLinks: {
          include: {
            medicament: true,
          },
        },
      },
    });

    res.status(201).json(medicamentatieWithRelations);
  } catch (error) {
    console.error("Eroare la crearea medicamentatiei:", error);
    res.status(500).json({
      error: "Ooops! Ceva nu a functionat bine. Te rog incearca mai tarziu.",
    });
  }
};

export const getMedicamentatie = async (req, res) => {
  const { userId: paramUserId } = req.params;
  const userId = parseInt(paramUserId);


  try {
    const medicamentaties = await prisma.medicamentatie.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        name: true,
        startDate: true,
        endDate: true,
        medicamenteLinks: {
          select: {
            quantity: true,
            medicament: {
              select: {
                name: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });


    res.status(200).json(medicamentaties);
  } catch (error) {
    console.error("Eroare la obtinerea medicamentatiei:", error);
    res.status(500).json({
      error: "Ooops! Ceva nu a functionat bine. Te rog incearca mai tarziu.",
    });
  }
};
