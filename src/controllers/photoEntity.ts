import { Request, Response } from 'express';

import { Photo } from '../entitys/photoEntity';
import { AppDataSource } from '../configs/db';

export const createPhoto = async (req: Request, res: Response) => {
    try {
        const { name, url, description } = req.body;
        if (!name || !description || !url) {
            return res.status(404).json({ message: 'Invalid name or url or description'})
        }
        const photos = await AppDataSource.getRepository(Photo);
        const photosAdd = await photos.create({ name, description, url }).save();
        if (!photosAdd) {
            return res.status(404).json({ message: 'can not create photo' })
        }
        return res.status(200).json({ message:'create success', data: photosAdd })
    } catch (error) {
        return res.status(500).json({message: error})
    }
}