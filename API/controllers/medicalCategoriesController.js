export const categoriesWithParameters = async () => {
    return await prisma.medical_Category.findMany({
        include: {
            parameters: true,
        },
    })
}
