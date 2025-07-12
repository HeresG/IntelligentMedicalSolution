import prisma from "../config/databaseInstance.js";

export const getPersonalData = async (req, res) => {
  const { userId } = req.user;
  try {
    const personalData = await prisma.personal_Data.findUnique({
      where: {
        userId
      },
      include: {
        details: true
      }
    })
    res.status(200).json({ message: "Datele au fost agregate cu succes", data: personalData })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: 'Eroare interna' });
  }
}

export const getPersonalDataById = async (req, res) => {
  const { userId } = req.params;
  try {
    const personalData = await prisma.personal_Data.findUnique({
      where: {
        userId: +userId,
      },
      include: {
        details: true,
      },
    });

    if (!personalData) {
      return res.status(404).json({ error: "No personal data found for this user" });
    }

    res.status(200).json({ data: personalData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Eroare interna' });
  }
};


export const savePersonalDataById = async (req, res) => {
  const { userId: paramUserId } = req.params;
  const userId = parseInt(paramUserId);

  const personalData = await prisma.personal_Data.findUnique({
    where: {
      userId
    }
  })

  return Boolean(personalData) ? updatePersonalDataById(req, res) : personalDataSetup(req, res)
}



export const personalDataSetup = async (req, res) => {
  const { cnp, firstName, lastName, address, phoneNumber, details } = req.body;
  const { userId: paramUserId } = req.params;

  try {
    let userId = parseInt(paramUserId);

    if (paramUserId == null) {
      userId = req.user.userId
    }

    const existingPersonalData = await prisma.personal_Data.findUnique({
      where: { cnp }
    });

    if (existingPersonalData) {
      return res.status(400).json({
        message: 'CNP-ul introdus exista deja in baza de date.',
      });
    }

    const personalData = await prisma.personal_Data.create({
      data: {
        cnp,
        firstName,
        lastName,
        address,
        phoneNumber,
        user: { connect: { id: userId } },

        details: {
          create: {
            fumator: details?.fumator ?? false,
            sarcinaActiva: details?.sarcinaActiva ?? false,
            diabet: details?.diabet ?? false,
            nrSarciniAnterioare: details?.nrSarciniAnterioare ?? 0
          }
        }
      },
      include: {
        details: true,
      }
    });

    res.status(201).json({
      message: "Datele au fost incarcate cu success!",
      data: personalData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Eroare interna' });
  }
};




export const updatePersonalDataById = async (req, res) => {
  const { cnp, firstName, lastName, address, phoneNumber, details } = req.body;
  const { userId: paramUserId } = req.params;

  try {
    const userId = parseInt(paramUserId);
    const data = await prisma.personal_Data.update({
      where: { userId },
      data: {
        cnp,
        firstName,
        lastName,
        address,
        phoneNumber,
        details: {
          upsert: {
            create: {
              fumator: details?.fumator ?? false,
              sarcinaActiva: details?.sarcinaActiva ?? false,
              diabet: details?.diabet ?? false,
              nrSarciniAnterioare: details?.nrSarciniAnterioare ?? 0
            },
            update: {
              fumator: details?.fumator ?? false,
              sarcinaActiva: details?.sarcinaActiva ?? false,
              diabet: details?.diabet ?? false,
              nrSarciniAnterioare: details?.nrSarciniAnterioare ?? 0
            }
          }
        }
      },
      include:{
        details: true
      }
    });

    res.status(200).json({data});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Eroare interna' });
  }
};



export const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        NOT: {
          personalData: null
        }
      },
      select: {
        id: true,
        email: true,
        personalData: {
          select: {
            cnp: true,
            firstName: true,
            lastName: true,
            address: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        medicamentatie: {
          select: {
            name: true,
            startDate: true,
            endDate: true
          }
        },
        analize: {
          select: {
            analyzeTitle: true,
            testingDate: true,
            assignedDoctor: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        }
      },
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching clients' });
  }
};

export const getClientById = async (req, res) => {
  const { userId: paramUserId } = req.params;
  const userId = parseInt(paramUserId);

  try {
    const client = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        personalData: {
          select: {
            cnp: true,
            firstName: true,
            lastName: true,
            address: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            details: true
          },
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the client' });
  }
}


export const getAllUsers = async (_, res) => {
  try {
    const clients = await prisma.user.findMany({
      where: {
        NOT: {
          role: "ADMIN"
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        personalData: {
          select: {
            id: true,
            cnp: true,
            firstName: true,
            lastName: true,
            address: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            details: {
              select: {
                fumator: true,
                sarcinaActiva: true,
                diabet: true,                
                nrSarciniAnterioare: true
              }
            }
          },
        },
      },
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching clients' });
  }
}




