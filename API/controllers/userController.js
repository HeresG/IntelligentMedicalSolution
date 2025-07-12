import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/databaseInstance.js';
import { getJWTSecret } from '../config/config.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'Utilizator creat cu succes' });
  } catch (error) {
    res.status(400).json({ error: 'Adresa de email exista deja' });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Adresa de email sau parola invalida' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, getJWTSecret(), {
      expiresIn: '1h',
    });
    res.json({ token, email: user.email });
  } catch (error) {    
    console.error(error.message)
    res.status(500).json({ error: 'Eroare interna' });
  }
}


export const verifySession = async (req, res) => {
  const {userId, role} = req.user  
  
  let userRole;

  try{
    const personalData = await prisma.personal_Data.findUnique({
      where: {
        userId: userId,
      }   
    });

    if(!role){
      const user = await prisma.user.findUnique({
        where: {id: userId}
      })      
      userRole = user.role;
      
    }else{
      userRole = role;      
    }    

    if(!personalData){
      return res.status(200).json({
        message: "Trebuie sa completati datele personale pentru a continua accesarea aplicatiei",
        data: {
          personalData: {
            userId
          },
          role: userRole
        }
      })
    }

    res.status(200).json({message: "Validare verificata cu success!", data: {
      personalData,
      role: userRole
    }})
  }catch(error){
    console.error(error.message);    
  }
}


export const deleteUserById = async (req, res) => {
  const { id } = req.params; 
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id), 
      },
    });

    res.status(200).json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};
