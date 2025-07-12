import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs'

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'root@licentamedicala.ro', password: 'contadmin', role: 'ADMIN' },
    { email: 'doctor1@ims.com', password: 'doctor', role: 'DOCTOR' },
    { email: 'doctor2@ims.com', password: 'doctor', role: 'DOCTOR' },
    { email: 'client1@yahoo.com', password: 'client', role: 'CLIENT' },
    { email: 'client2@yahoo.com', password: 'client', role: 'CLIENT' },
    { email: 'client3@yahoo.com', password: 'client', role: 'CLIENT' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        role: user.role,
      },
    });
  }

  // Medicamente
  const meds = [
    { name: 'Essentiale® Forte', description: 'Fosfolipide esențiale care ajută la regenerarea celulelor hepatice' },
    { name: 'Legalon', description: 'Conține silimarină; protejează ficatul de toxine și susține funcția hepatică' },
    { name: 'Tenofovir ', description: 'Antiviral folosit în tratamentul hepatitei B cronice' },
    { name: 'Epclusa', description: 'Tratament combinat pentru hepatita C cronică' },
    { name: 'Lactuloză', description: 'Laxativ osmotic utilizat pentru prevenirea encefalopatiei hepatice' },
    { name: 'Tamoxifen', description: 'Blocant al receptorilor de estrogen, folosit în cancerul de sân hormonal-dependent' },
    { name: 'Anastrozol', description: 'Inhibitor de aromatază, scade nivelul de estrogen la femeile aflate la menopauză' },
    { name: 'Trastuzumab', description: 'Anticorp monoclonal folosit în cazurile de cancer de sân HER2-pozitiv' },
    { name: 'Paclitaxel', description: 'Agent chimioterapic care oprește diviziunea celulelor canceroase' },
    { name: 'Letrozol', description: 'Inhibitor de aromatază, indicat în tratamentul adjuvant postmenopauză' },
  ];

  for (const med of meds) {
    await prisma.medicamente.upsert({
      where: { name: med.name },
      update: {},
      create: med,
    });
  }

  // Medical Categories
  const categories = [
    { name: "Oncologie", description: "Oncologia se ocupă cu prevenirea, diagnosticarea și tratamentul cancerului." },
    { name: "Hepatologie", description: "Hepatologia se ocupă cu studiul și tratamentul bolilor ficatului, vezicii biliare și căilor biliare." }
  ];


  for (const category of categories) {
    await prisma.medical_Category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Fetch category IDs by name
  const categoryMap = Object.fromEntries(
    await Promise.all(
      categories.map(async (cat) => {
        const dbCat = await prisma.medical_Category.findUnique({ where: { name: cat.name } });
        return [cat.name, dbCat?.id];
      })
    )
  );

  // Medical Parameters
  const parameters = [
    {
      name: "Total_Bilirubin",
      ro_l18n: "Nivel bilirubina",
      unit: "mg/dL",
      type: "float",
      min_val: 0.5,
      max_val: 30.8,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "Direct_Bilirubin",
      ro_l18n: "Bilirubina conjugata",
      unit: "mg/dL",
      type: "float",
      min_val: 0.1,
      max_val: 18.3,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "Alkaline_Phosphotase",
      ro_l18n: "Activitate enzima fosfotazei alcaline",
      unit: "U/L",
      type: "numeric",
      min_val: 63,
      max_val: 1896,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "Alamine_Aminotransferase",
      ro_l18n: "Activitate enizma ALT",
      unit: "U/L",
      type: "numeric",
      min_val: 11,
      max_val: 2000,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "Aspartate_Aminotransferase",
      ro_l18n: "Activitate enzima AST",
      unit: "U/L",
      type: "numeric",
      min_val: 14,
      max_val: 4929,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "Total_Protiens",
      ro_l18n: "Total proteine plasmatice",
      unit: "g/dL",
      type: "float",
      min_val: 3.6,
      max_val: 8.5,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "Albumin",
      ro_l18n: "Nivel albumina in sange",
      unit: "g/dL",
      type: "float",
      min_val: 1,
      max_val: 5.5,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "Albumin_and_Globulin_Ratio",
      ro_l18n: "Raport. albumina si globuline",
      unit: "N/A",
      type: "float",
      min_val: 0.3,
      max_val: 1.8,
      medicalCategoryId: categoryMap["Hepatologie"],
    },
    {
      name: "radius_mean",
      ro_l18n: "Media distantei de la centrul tumorii la margine",
      unit: "mm",
      type: "float",
      min_val: 6.98,
      max_val: 28.1,
      medicalCategoryId: categoryMap["Oncologie"],
    },
    {
      name: "texture_mean",
      ro_l18n: "Variatia texturii imaginii tumorii",
      unit: "N/A",
      type: "float",
      min_val: 9.71,
      max_val: 39.3,
      medicalCategoryId: categoryMap["Oncologie"],
    },
    {
      name: "perimeter_mean",
      ro_l18n: "Lungimea medie a marginii tumorii",
      unit: "mm",
      type: "float",
      min_val: 43.8,
      max_val: 189,
      medicalCategoryId: categoryMap["Oncologie"],
    },
    {
      name: "area_mean",
      ro_l18n: "Aria medie a tumorii",
      unit: "mm^2",
      type: "float",
      min_val: 144,
      max_val: 2500,
      medicalCategoryId: categoryMap["Oncologie"],
    },
    {
      name: "smoothness_mean",
      ro_l18n: "Variatia locala a lungimii marginii",
      unit: "N/A",
      type: "float",
      min_val: 0.05,
      max_val: 0.16,
      medicalCategoryId: categoryMap["Oncologie"],
    },
    {
      name: "compactness_mean",
      ro_l18n: "Masura a compacitatii tumorii",
      unit: "N/A",
      type: "float",
      min_val: 0.02,
      max_val: 0.35,
      medicalCategoryId: categoryMap["Oncologie"],
    },
    {
      name: "concavity_mean",
      ro_l18n: "Severitatea concavitatii tumorii",
      unit: "N/A",
      type: "float",
      min_val: 0,
      max_val: 0.43,
      medicalCategoryId: categoryMap["Oncologie"],
    },
    {
      name: "concave_points_mean",
      ro_l18n: "Numarul punctelor concave pe margine",
      unit: "N/A",
      type: "float",
      min_val: 0,
      max_val: 0.2,
      medicalCategoryId: categoryMap["Oncologie"],
    }
  ];

  for (const param of parameters) {
    await prisma.medical_Parameter.upsert({
      where: {
        name_medicalCategoryId: {
          name: param.name,
          medicalCategoryId: param.medicalCategoryId,
        },
      },
      update: {},
      create: {
        name: param.name,
        ro_l18n: param.ro_l18n,
        unit: param.unit,
        type: param.type,
        min_val: param.min_val,
        max_val: param.max_val,
        category: {
          connect: { id: param.medicalCategoryId },
        },
      },

    });
  }

  const uploader = await prisma.user.findUnique({
    where: { email: 'root@licentamedicala.ro' },
  });
  if (!uploader) {
    throw new Error("Uploaderul 'root@licentamedicala.ro' nu a fost găsit.");
  }

  const images = [
    {
      name: 'info_boli_cardio.jpg',
      key: 'medical-images/info_boli_cardio.jpg',
      mimeType: 'image/jpg',
      description: 'Imagine articol boli cardio',
    },    
    {
      name: 'info_boli_dermatologic.jpg',
      key: 'medical-images/info_boli_dermatologic.jpg',
      mimeType: 'image/jpg',
      description: 'Imagine articol boli dermatologice',
    },
    {
      name: 'info_boli_infectioase.jpg',
      key: 'medical-images/info_boli_infectioase.jpg',
      mimeType: 'image/jpg',
      description: 'Imagine articol boli infectioase',
    },
    {
      name: 'info_boli_neurologice.jpg',
      key: 'medical-images/info_boli_neurologice.jpg',
      mimeType: 'image/jpg',
      description: 'Imagine articol boli neurologice',
    },
    {
      name: 'info_boli_endocrinologice.jpg',
      key: 'medical-images/info_boli_endocrinologice.jpg',
      mimeType: 'image/jpg',
      description: 'Imagine articol boli endocrinologie',
    },  
    {
      name: 'info_boli_reumatologie.jpg',
      key: 'medical-images/info_boli_reumatologie.jpg',
      mimeType: 'image/jpg',
      description: 'Imagine articol boli reumatologie',
    }
  ];

  for (const img of images) {
    await prisma.fileS3.upsert({
      where: { key: img.key },
      update: {},
      create: {
        name: img.name,
        key: img.key,
        mimeType: img.mimeType,
        description: img.description,
        uploaderId: uploader.id,
      },
    });
  }

  const fileMap = {};
  for (const img of images) {
    const file = await prisma.fileS3.findUnique({ where: { key: img.key } });
    if (file) {
      fileMap[img.key] = file.id;
    }
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const cardioArticleContent = readFileSync(
    join(__dirname, 'articleSeeds', 'articleSeed_boli_cardiovasculare.txt'),
    'utf8'
  );

  const dermaArticleContent = readFileSync(
    join(__dirname, 'articleSeeds', 'articleSeed_boli_dermatologice.txt'),
    'utf8'
  );

  const infectioaseArticleContent = readFileSync(
    join(__dirname, 'articleSeeds', 'articleSeed_boli_infectioase.txt'),
    'utf8'
  );

  const neurologiceArticleContent = readFileSync(
    join(__dirname, 'articleSeeds', 'articleSeed_boli_neurologice.txt'),
    'utf8'
  );

  const endoArticleContent = readFileSync(
    join(__dirname, 'articleSeeds', 'articleSeed_boli_endocrinologice.txt'),
    'utf8'
  );

  const reumaArticleContent = readFileSync(
    join(__dirname, 'articleSeeds', 'articleSeed_boli_reumatologie.txt'),
    'utf8'
  );
  
  
  const articles = [
    {
      name: 'Bolile cardiovasculare',
      description: 'Bolile cardiovasculare reprezintă una dintre principalele cauze de mortalitate la nivel global, afectând inima și vasele de sânge. Aceste afecțiuni pot fi prevenite în mare măsură printr-un stil de viață sănătos, dar necesită atenție și tratament adecvat pentru a preveni complicațiile.',
      content: cardioArticleContent,
      imageKey: 'medical-images/info_boli_cardio.jpg',
    },    
    {
      name: 'Bolile dermatologice',
      description: 'Bolile dermatologice afectează pielea, părul, unghiile și mucoasele, fiind frecvent întâlnite și variind de la afecțiuni ușoare, precum acneea, până la boli cronice, cum ar fi psoriazisul. Pielea, fiind cel mai mare organ al corpului, are un rol esențial în protecția organismului împotriva factorilor externi.',
      content: dermaArticleContent,
      imageKey: 'medical-images/info_boli_dermatologic.jpg',
    },       
    {
      name: 'Bolile infectioase',
      description: 'Bolile infecțioase sunt cauzate de microorganisme patogene precum bacterii, virusuri, fungi și paraziți. Ele se pot transmite prin contact direct, aer, apă sau alimente contaminate.',
      content: infectioaseArticleContent,
      imageKey: 'medical-images/info_boli_infectioase.jpg',
    },
    {
      name: 'Bolile neurologice',
      description: 'Bolile neurologice sunt afecțiuni care afectează sistemul nervos central și sistemul nervos periferic. Acestea pot fi cauzate de factori genetici, leziuni, infecții sau boli autoimune, având un impact semnificativ asupra calității vieții.',
      content: neurologiceArticleContent,
      imageKey: 'medical-images/info_boli_neurologice.jpg',
    },
    {
      name: 'Bolile endocrinologice',
      description: 'Bolile endocrinologic reprezintă afecțiuni ale glandelor endocrine, care produc hormoni esențiali pentru reglarea metabolismului, creșterii, dezvoltării și funcționării corecte a organismului. Dezechilibrele hormonale pot afecta multiple organe și sisteme, necesitând diagnostic precis și tratament personalizat.',
      content: endoArticleContent,
      imageKey: 'medical-images/info_boli_endocrinologice.jpg',
    },
    {
      name: 'Bolile reumatologice',
      description: 'Bolile reumatologice reprezintă un grup larg de afecțiuni care afectează articulațiile, mușchii, oasele și uneori organele interne. Aceste boli pot cauza durere, inflamație, rigiditate și pierderea funcției articulare, necesitând diagnostic precoce și tratament adecvat pentru a preveni deteriorarea permanentă.',
      content: reumaArticleContent,
      imageKey: 'medical-images/info_boli_reumatologie.jpg',
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { name: article.name },
      update: {},
      create: {
        name: article.name,
        description: article.description,
        content: article.content,
        imageId: fileMap[article.imageKey],
        uploadedById: uploader.id,
      },
    });
  }

}

main()
  .then(() => console.log("✅ Seed uploaded successfully!"))
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
