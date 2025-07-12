const checkDbConnection = async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Conexiune la baza de date reusita!');
    } catch (error) {
      console.error('Eroare la conectarea la baza de date:', error);
      process.exit(1);
    }
  };

  export default checkDbConnection