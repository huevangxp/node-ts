import { Request, Response } from "express";
import { AppDataSource } from "../configs/db";
import { User } from "../entitys/userEntify";

import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const userRes = await AppDataSource.getRepository(User);
    const users = await userRes.find();
    users && res.send(users);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // const idNumber = Numb/er(id);

    const userRes = await AppDataSource.getRepository(User);
    const users = await userRes.findOne({ where: { id: id } });
    if (!users) {
      return res.status(404).json({ message: "this no data" });
    }
    return res.status(200).json({ message: "success", data: users });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const results = await AppDataSource.getRepository(User);
    //check user in db
    const checkUser = await results.findOne({
      where: { username: req.body.username },
    });
    if (checkUser) {
      return res.status(404).json({ message: "this user is already" });
    }
    // hash password to symbol
    const newPass = await bcrypt.hash(password, 10);
    // create user
    const users = await results.create({
      username,
      password: newPass,
      email,
    });
    const saveUser = await results.save(users);
    if (!saveUser) {
      return res
        .status(404)
        .json({ message: "can not create user repository" });
    }
    return res.status(200).json({ message: "create success", data: saveUser });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const results = await AppDataSource.getRepository(User);
    const checkUser = await results.findOneBy({ id: id });
    if (!checkUser) {
      return res.status(404).json({ message: "no this user" });
    }

    const userUpdated = await results.merge(checkUser, req.body);

    return res
      .status(200)
      .json({ message: "Update this user", data: userUpdated });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      if (!id) {
          return res.status(404).json({ message:"id is required"})
      }
    const userRes = await AppDataSource.getRepository(User);
    const checkUser = await userRes.findOne({ where: { id } });
    if (!checkUser) {
      return res.status(404).send({ message: "User not found" });
      }
      const removeUser = await userRes.delete(id);
      if (!removeUser) {
          return res.status(404).send({ message: "User not found" });
      }
      return res.status(204).send({ message: "delete successfully"})
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const users = await AppDataSource.getRepository(User).findOne({
      where: { username: username },
    });
    if (!users) {
      return res.status(401).json({ message: "this account not found!" });
    }
    const checkPass = await bcrypt.compare(password, users.password);
    // console.log(checkPass,users);
    if (!checkPass) {
      return res.status(401).json({ message: "password incoract!" });
    }

    const userToken = {
      username: users.username,
      email: users.email,
    };

    const token = await jwt.sign(userToken, "huevang-Test-node*ts", {
      expiresIn: "24h",
    });

    if (!token) {
      return res.status(401).json({ message: "token not valid" });
    }

    return res
      .status(200)
      .json({ message: "login success", data: userToken, token: token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userRes = await AppDataSource.getRepository(User);
    const checkUser = await userRes.findOne({
      where: { username: req.body.username },
    });
    if (!checkUser) {
      return res.status(401).json({ message: "User not found" });
    }
    const checkPass = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!checkPass) {
      return res.status(401).json({ message: "password not match" });
    }
    const changePass = await userRes
      .createQueryBuilder()
      .update(User)
      .set({ password: req.body.password })
      .where("id = :id", { id: req.params.id })
      .execute();
    if (!changePass) {
      return res.status(401).json({ message: "can not change password" });
    }
    return res.status(200).json({ message: "change password successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
