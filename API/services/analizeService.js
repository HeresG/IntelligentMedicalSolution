import { categoriesWithParameters } from "../controllers/medicalCategoriesController.js";
import { Utils } from "../utils/utils.js";
import { uploadBufferToS3 } from "./blobService.js";
import axios from 'axios'

export const getMedicalCategoriesAndParameters = async (req, res) => {
    try {
        const categories = await categoriesWithParameters();
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Eroare la incarcarea categoriilor medicale si parametrii:', error);
        res.status(500).json({
            error: 'Nu s-au putut incarca categoriile medicale si parametrii.',
        });
    }
}


export const createMedicalAnalysis = async (req, res) => {
    const { testingDate, analyzeTitle, institution, doctor, notes, categories } = req.body;
    const uploadedFile = req.file;
    const { userId } = req.user;

    const parsedCategories = JSON.parse(categories || '[]');

    try {
        let fileRecord = null;

        if (uploadedFile) {
            const { key, name, mimeType } = await uploadBufferToS3(
                uploadedFile.buffer,
                uploadedFile.originalname,
                uploadedFile.mimetype
            );

            fileRecord = await prisma.fileS3.create({
                data: {
                    key,
                    name,
                    mimeType,
                    uploaderId: userId,
                    description: 'File uploaded with medical analysis',
                },
            });
        }

        const analyze = await prisma.medical_Analyze.create({
            data: {
                testingDate: testingDate ? new Date(testingDate) : null,
                analyzeTitle,
                institution,
                doctor,
                notes,
                userId,
                fileId: fileRecord?.id || null,
            },
        });

        for (const category of parsedCategories) {
            const categoryRecord = await prisma.medical_Category.findUnique({
                where: { name: category.name },
                include: { parameters: true },
            });

            if (!categoryRecord) continue;

            await prisma.medical_Analyze_Category.create({
                data: {
                    analyzeId: analyze.id,
                    categoryId: categoryRecord.id,
                },
            });

            for (const param of category.parameters) {
                const matchedParam = categoryRecord.parameters.find((p) => p.name === param.name);
                if (!matchedParam) continue;

                await prisma.medical_Analyze_Result.create({
                    data: {
                        analyzeId: analyze.id,
                        parameterId: matchedParam.id,
                        value: param.value,
                    },
                });
            }
        }

        return res.status(201).json({
            id: analyze.id,
            analyzeTitle: analyze.analyzeTitle,
            testingDate: analyze.testingDate,
            createdAt: analyze.createdAt,
            assignedDoctor: analyze?.assignedDoctor
        });
    } catch (error) {
        console.error('Eroare la crearea analizei medicale:', error);
        res.status(500).json({
            error: 'Nu s-a putut crea analiza medicala.',
        });
    }
};

export const getUserAnalyzeDataById = async (req, res) => {
    const { userId, analyzeId } = req.params;
    try {
        const myAnalyzeData = await prisma.medical_Analyze.findUnique({
            where: {
                id: parseInt(analyzeId)
            },
            select: {
                id: true,
                analyzeTitle: true,
                testingDate: true,
                createdAt: true,
                institution: true,
                doctor: true,
                notes: true,
                user: {
                    select: {
                        id: true
                    }
                },
                file: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                assignedDoctor: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        personalData: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                results: {
                    include: {
                        parameter: {
                            select: {
                                name: true,
                                ro_l18n: true,
                                unit: true,
                                type: true,
                                medicalCategoryId: true,
                            },
                        },
                    },
                },
            },
        });

        if (myAnalyzeData.user.id !== parseInt(userId)) {
            return res.status(401).json({ message: "Nu aveti acces la aceasta analiza" })
        }

        return res.status(200).json(myAnalyzeData);
    } catch (error) {
        console.error('Eroare la crearea analizei medicale:', error);
        res.status(500).json({
            error: 'Nu s-au putut agrega datele introduse de dumneavoastra pentru analiza cu id: ' + analyzeId,
        });
    }
}
export const getUserAnalyzeDiagnosisById = async (req, res) => {
    const { userId, analyzeId } = req.params;
    try {
        const myAnalyzeData = await prisma.medical_Analyze.findUnique({
            where: {
                id: parseInt(analyzeId)
            },
            select: {
                id: true,
                diagnosis: true,
                user: {
                    select: {
                        id: true
                    }
                },
                mlResults: true
            }
        });

        if (myAnalyzeData.userId === parseInt(userId)) {
            return res.status(401).json({ message: "Nu aveti acces la aceasta analiza" })
        }

        const payload = {
            ...myAnalyzeData,
            mlResults: myAnalyzeData.mlResults.filter(r => r.includeInReport)
        }


        return res.status(200).json(payload);
    } catch (error) {
        console.error('Eroare la crearea analizei medicale:', error);
        res.status(500).json({
            error: 'Nu s-au putut agrega datele introduse de dumneavoastra pentru analiza cu id: ' + analyzeId,
        });
    }
}

export const deleteUserAnalyzeById = async (req, res) => {
    const { userId, analyzeId } = req.params;
    const { role } = req.user;

    if (!userId || !analyzeId) {
        return res.status(400).json({ error: "Missing userId or analyzeId" });
    }

    try {
        const analyze = await prisma.medical_Analyze.findUnique({
            where: { id: parseInt(analyzeId) },
            include: { user: true },
        });

        if (!analyze) {
            return res.status(404).json({ error: "Analyze not found" });
        }

        if (role !== 'DOCTOR' && role !== 'ADMIN' && analyze.userId !== parseInt(userId)) {
            return res.status(403).json({ error: "Unauthorized access to analyze" });
        }

        await prisma.medical_Analyze.delete({
            where: { id: parseInt(analyzeId) },
        });

        return res.status(200).json({ message: "deleted" })
    } catch (error) {
        console.error('Eroare la stergerea analizei medicale:', error);
        return res.status(500).json({
            error: 'Nu s-a putut sterge analiza medicala.',
        });
    }
};



export const getUserAnalyzesById = async (req, res) => {
    const { userId: paramUserId } = req.params;
    const { role } = req.user;
    const userId = parseInt(paramUserId);


    try {
        const analyzes = await prisma.medical_Analyze.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                analyzeTitle: true,
                testingDate: true,
                createdAt: true,
                institution: (role === "DOCTOR" || role === 'ADMIN'),
                doctor: role === "DOCTOR" || role === 'ADMIN',
                notes: role === "DOCTOR" || role === 'ADMIN',
                diagnosis: role === "DOCTOR" || role === 'ADMIN',
                mlResults: role === "DOCTOR" || role === 'ADMIN',
                file: (role === "DOCTOR" || role === 'ADMIN') && {
                    select: {
                        id: true,
                        name: true
                    }
                },

                assignedDoctor: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        personalData: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                },
                categories: (role === "DOCTOR" || role === 'ADMIN') && {
                    include: {
                        category: true,
                    },
                },
                results: (role === "DOCTOR" || role === 'ADMIN') && {
                    include: {
                        parameter: {
                            select: {
                                name: true,
                                ro_l18n: true,
                                unit: true,
                                type: true,
                                medicalCategoryId: true,
                            },
                        },
                    },
                },
            },
        });


        return res.status(200).json(analyzes);

    } catch (error) {
        console.error('Error fetching user analyzes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const assignDoctorToAnalyze = async (req, res) => {
    const doctorId = req.user.userId;
    const { analyzeId } = req.body;

    try {
        const analyze = await prisma.medical_Analyze.findUnique({
            where: { id: parseInt(analyzeId) },
            select: {
                id: true,
                assignedDoctor: {
                    select: { id: true }
                }
            }
        });

        if (!analyze) {
            return res.status(404).json({ error: "Analiza nu a fost găsită." });
        }

        if (analyze.assignedDoctor) {
            return res.status(400).json({ error: "Un doctor a preluat deja analiza pacientului." });
        }

        const updatedAnalyze = await prisma.medical_Analyze.update({
            where: { id: parseInt(analyzeId) },
            data: {
                assignedDoctor: {
                    connect: { id: parseInt(doctorId) },
                },
            },
            select: {
                assignedDoctor: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        personalData: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                },
            },
        });

        return res.status(200).json(updatedAnalyze);
    } catch (error) {
        console.error("Eroare la atribuirea doctorului:", error);
        return res.status(500).json({ error: "Eroare internă la server." });
    }
};


export const saveDiagnosis = async (req, res) => {
    const { doctorNote, mlResults } = req.body;
    const { analyzeId } = req.params;

    try {
        // 1. Create new diagnosis for the analyze
        const diagnosis = await prisma.medical_Analyze_Diagnosis.create({
            data: {
                doctorNote,
                analyze: { connect: { id: parseInt(analyzeId) } },
            },
        });

        // 2. Update mlResults that match resultName and analyzeId
        for (const result of mlResults) {
            await prisma.medical_Analyze_ML_Result.updateMany({
                where: {
                    analyzeId: parseInt(analyzeId),
                    resultName: result.resultName,
                },
                data: {
                    includeInReport: result.includeInReport
                },
            });
        }

        return res.status(200).json(diagnosis);
    } catch (error) {
        console.error("Eroare la salvarea diagnosticului:", error);
        return res.status(500).json({ error: "Eroare internă la server." });
    }
};




export const startMLForAnalyzeId = async (req, res) => {
    const { analyzeId } = req.body;

    try {
        const results = await prisma.medical_Analyze_Result.findMany({
            where: {
                analyzeId
            },
            include: {
                parameter: true,
                analyze: {
                    include: {
                        user: {
                            include: {
                                personalData: {
                                    include: {
                                        details: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });


        const cnp = results[0].analyze.user.personalData?.cnp;
        const pregnancies = results[0].analyze.user.personalData?.details?.nrSarciniAnterioare;


        const payload = {};

        for (const result of results) {
            const name = result.parameter.name;
            payload[name] = result.value;
        }

        payload['Age'] = Utils.getAgeFromCNP(cnp);
        payload['Pregnancies'] = pregnancies;
        payload['Gender'] = Utils.getGenderFromCNP(cnp);

        const responseFromML = await axios.post(process.env.ML_APP_PATH + "/predict", {
            parameters: payload
        });


        const mlResults = responseFromML.data.results;

        console.log(mlResults)
        const savedResults = [];

        for (const result of mlResults) {
            const saved = await prisma.medical_Analyze_ML_Result.create({
                data: {
                    resultName: result.disease,
                    confirmed: result.prediction,
                    includeInReport: false,
                    analyze: { connect: { id: analyzeId } }
                }
            });

            savedResults.push(saved);
        }

        res.status(200).json(savedResults);

    } catch (error) {
        console.error('Error encountered by ML', error);
        res.status(500).json({ error: 'Internal server error' })
    }


}