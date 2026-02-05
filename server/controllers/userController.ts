import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// get user credit
export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json({ credits: user?.credits });
  } catch (error: any) {
    console.log(error, "getUserCredits error");
    return res.status(401).json({ message: error.message });
  }
};

// create new project
export const createUserProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
      const { initial_prompt } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
     const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if(user && user.credits < 5) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

// create project
    const project = await prisma.websiteProject.create({
      data: {
        name: initial_prompt > 50 ? initial_prompt.substring(0, 47) + "..." : initial_prompt,
        initial_prompt,
        userId,
      },
    });
    // update user credits
    await prisma.user.update({
        where: { id: userId },
        data: { totalCreation: { increment: 1 } },
    })
    res.json(project);
  } catch (error: any) {
    console.log(error, "createProject error");
    return res.status(401).json({ message: error.message });
  }
};
